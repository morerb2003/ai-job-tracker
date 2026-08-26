package com.rohit.jobtracker.auth;

import java.util.UUID;

import com.rohit.jobtracker.user.UserRole;

public record AuthResponse(
        UUID userId,
        String name,
        String email,
        UserRole role,
        String accessToken,
        String tokenType,
        long expiresIn,
        String message
) {
    public AuthResponse(
            UUID userId,
            String name,
            String email,
            UserRole role,
            String accessToken,
            long expiresIn,
            String message) {
        this(userId, name, email, role, accessToken, "Bearer", expiresIn, message);
    }

    public AuthResponse(
            UUID userId,
            String name,
            String email,
            UserRole role,
            String message) {
        this(userId, name, email, role, null, null, 0, message);
    }
}
