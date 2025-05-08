package com.codequest.backend.controller;

import com.codequest.backend.entity.User;
import com.codequest.backend.repository.UserRepository;
import com.codequest.backend.service.JwtService;
import com.codequest.backend.service.UserDetailsServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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

    @GetMapping("/authorization/google")
    public ResponseEntity<?> redirectToGoogleAuthorization() {
        try {
            String redirectUri = "http://localhost:8080/auth/google/callback";
            String authorizationUri = "https://accounts.google.com/o/oauth2/v2/auth" +
                    "?client_id=" + clientId +
                    "&redirect_uri=" + redirectUri +
                    "&response_type=code" +
                    "&scope=openid%20profile%20email" +
                    "&access_type=offline" +
                    "&prompt=consent";

            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(new URI(authorizationUri));
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        } catch (Exception e) {
            log.error("Error redirecting to Google OAuth", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during Google OAuth");
        }
    }

    @GetMapping("/callback")
    public ResponseEntity<?> handleGoogleCallback(@RequestParam String code) {
        try {
            // Step 1: Exchange code for access token
            String redirectUri = "http://localhost:8080/auth/google/callback";
            String tokenEndpoint = "https://oauth2.googleapis.com/token";

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("code", code);
            params.add("client_id", clientId);
            params.add("client_secret", clientSecret);
            params.add("redirect_uri", redirectUri);
            params.add("grant_type", "authorization_code");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

            ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(tokenEndpoint, request, Map.class);
            if (!tokenResponse.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to get token from Google");
            }

            String idToken = (String) tokenResponse.getBody().get("id_token");

            // Step 2: Get user info from ID token
            String userInfoUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
            ResponseEntity<Map> userInfoResponse = restTemplate.getForEntity(userInfoUrl, Map.class);
            if (!userInfoResponse.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to fetch user info");
            }

            Map<String, Object> userInfo = userInfoResponse.getBody();
            String email = (String) userInfo.get("email");

            // Step 3: Create or load user
            try {
                userDetailsService.loadUserByUsername(email);
            } catch (Exception e) {
                User newUser = new User();
                newUser.setUsername(email);
                newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                newUser.setRole("USER");
                userRepository.save(newUser);
            }

            // Step 4: Generate JWT
            org.springframework.security.core.Authentication authentication =
                    new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());
            String jwtToken = jwtService.generateToken(authentication);

            // Step 5: Redirect to frontend with token
            URI redirectUriWithToken = new URI(frontendRedirectUri + "?token=" + jwtToken);
            HttpHeaders redirectHeaders = new HttpHeaders();
            redirectHeaders.setLocation(redirectUriWithToken);
            return new ResponseEntity<>(redirectHeaders, HttpStatus.FOUND);

        } catch (Exception e) {
            log.error("Error handling Google callback", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("OAuth callback error");
        }
    }
}
