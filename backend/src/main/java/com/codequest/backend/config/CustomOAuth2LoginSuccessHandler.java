package com.codequest.backend.config;

import com.codequest.backend.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2LoginAuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomOAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;

    public CustomOAuth2LoginSuccessHandler(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2LoginAuthenticationToken oauth2Authentication = (OAuth2LoginAuthenticationToken) authentication;
        String username = oauth2Authentication.getName();  // You can extract the user details from here.

        // Generate JWT token
        String token = jwtService.generateToken(authentication);

        // Redirect to the front end with token in the URL
        response.sendRedirect("http://localhost:3000/oauth2-success?token=" + token);
    }
}
