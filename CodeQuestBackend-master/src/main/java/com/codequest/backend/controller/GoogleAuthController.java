package com.codequest.backend.controller;

import com.codequest.backend.entity.User;
import com.codequest.backend.repository.UserRepository;
import com.codequest.backend.service.JwtService;
import com.codequest.backend.service.UserDetailsServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.*;

@RestController
@RequestMapping("/auth/google")
@Slf4j
public class GoogleAuthController {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;

    @Value("${app.frontend.redirect-uri}")
    private String frontendRedirectUri;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    /**
     * Redirects user to Google's OAuth2 authorization URL
     */
    @GetMapping("/authorization/google")
    public ResponseEntity<?> redirectToGoogleAuthorization() {
        try {
            String redirectUri = frontendRedirectUri + "/auth/google/callback";
            String authorizationUri = "https://accounts.google.com/o/oauth2/v2/auth" +
                    "?client_id=" + clientId +
                    "&redirect_uri=" + redirectUri +
                    "&response_type=code" +
                    "&scope=openid%20profile%20email" +
                    "&access_type=offline" +
                    "&prompt=consent";

            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(URI.create(authorizationUri));
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        } catch (Exception e) {
            log.error("Error redirecting to Google OAuth", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during Google OAuth");
        }
    }

    /**
     * Handles Google's OAuth2 callback with the authorization code
     */
    @GetMapping("/callback")
    public ResponseEntity<?> handleGoogleCallback(@RequestParam("code") String code) {
        try {
            String redirectUri = frontendRedirectUri + "/auth/google/callback";

            // Step 1: Exchange code for access token
            MultiValueMap<String, String> tokenRequest = new LinkedMultiValueMap<>();
            tokenRequest.add("code", code);
            tokenRequest.add("client_id", clientId);
            tokenRequest.add("client_secret", clientSecret);
            tokenRequest.add("redirect_uri", redirectUri);
            tokenRequest.add("grant_type", "authorization_code");

            HttpHeaders tokenHeaders = new HttpHeaders();
            tokenHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(tokenRequest, tokenHeaders);

            Map<String, Object> tokenResponse = restTemplate.postForObject(
                    "https://oauth2.googleapis.com/token",
                    request,
                    Map.class
            );

            if (tokenResponse == null || !tokenResponse.containsKey("access_token")) {
                log.error("Invalid token response from Google");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Google token response");
            }

            String accessToken = (String) tokenResponse.get("access_token");

            // Step 2: Use access token to fetch user info
            HttpHeaders userInfoHeaders = new HttpHeaders();
            userInfoHeaders.setBearerAuth(accessToken);
            HttpEntity<?> userInfoRequest = new HttpEntity<>(userInfoHeaders);

            ResponseEntity<Map> userInfoResponse = restTemplate.exchange(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    HttpMethod.GET,
                    userInfoRequest,
                    Map.class
            );

            Map<String, Object> userInfo = userInfoResponse.getBody();
            if (userInfo == null || !userInfo.containsKey("email")) {
                log.error("Failed to fetch user info from Google");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Google user info");
            }

            String email = (String) userInfo.get("email");
            String name = (String) userInfo.get("name");

            // Step 3: Check if user exists or create new
            Optional<User> userOpt = userRepository.findByEmail(email);
            User user = userOpt.orElseGet(() -> {
                String dummyPassword = passwordEncoder.encode(UUID.randomUUID().toString());
                User newUser = new User(name, dummyPassword, email, "USER");
                return userRepository.save(newUser);
            });

            // Step 4: Generate JWT using UserDetails
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            String token = jwtService.generateToken(userDetails.getUsername());

            // Step 5: Redirect to frontend with JWT
            URI redirectWithToken = URI.create(frontendRedirectUri + "/login?token=" + token);
            HttpHeaders redirectHeaders = new HttpHeaders();
            redirectHeaders.setLocation(redirectWithToken);
            return new ResponseEntity<>(redirectHeaders, HttpStatus.FOUND);

        } catch (Exception e) {
            log.error("Google OAuth callback error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("OAuth error");
        }
    }
}
