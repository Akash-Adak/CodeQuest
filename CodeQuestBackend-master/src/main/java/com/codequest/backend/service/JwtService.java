package com.codequest.backend.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.Date;

@Service
public class JwtService {

    private final String SECRET_KEY = "your-secret-key"; // Use env var in production
    private final byte[] SECRET_KEY_BYTES = Base64.getEncoder().encode(SECRET_KEY.getBytes());

    // For standard login
    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        return generateToken(username);
    }

    // For OAuth2 login or any case where only username is available
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 24 * 3600000)) // 24 hours
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY_BYTES)
                .compact();
    }
}
