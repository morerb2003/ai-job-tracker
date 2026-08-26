package com.rohit.jobtracker.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.rohit.jobtracker.user.User;

import io.jsonwebtoken.Claims;

class JwtServiceTest {

    private JwtService jwtService;
    private final String secretKey = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private final long expirationMs = 900000; // 15 mins

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(secretKey, expirationMs);
    }

    @Test
    void shouldGenerateValidTokenForUser() {
        User user = new User("Rohit Sharma", "rohit@example.com", "encodedPassword");

        String token = jwtService.generateToken(user);

        assertNotNull(token);
        assertFalse(token.isBlank());
        assertEquals("rohit@example.com", jwtService.extractUsername(token));
        assertTrue(jwtService.isTokenValid(token, "rohit@example.com"));
        assertFalse(jwtService.isTokenValid(token, "other@example.com"));
        assertFalse(jwtService.isTokenExpired(token));
    }

    @Test
    void shouldExtractCustomClaims() {
        Map<String, Object> extra = new HashMap<>();
        extra.put("role", "ADMIN");
        extra.put("name", "Rohit Admin");

        String token = jwtService.generateToken(extra, "admin@example.com");

        Claims claims = jwtService.extractAllClaims(token);
        assertEquals("ADMIN", claims.get("role"));
        assertEquals("Rohit Admin", claims.get("name"));
        assertEquals("admin@example.com", claims.getSubject());
    }
}
