package com.codequest.backend.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.Date;

@Service
public class JwtService {

    private final String SECRET_KEY = "your-secret-key"; // Store this securely (maybe in env variables)
    private final byte[] SECRET_KEY_BYTES = Base64.getEncoder().encode(SECRET_KEY.getBytes());

    public String generateToken(Authentication authentication) {
        String username = authentication.getName(); // or use other info

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // token expiration (1 hour)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY_BYTES)
                .compact();
    }
}
