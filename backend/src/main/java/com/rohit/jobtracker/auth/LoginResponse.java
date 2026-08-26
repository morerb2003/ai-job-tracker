package com.rohit.jobtracker.auth;

import java.util.UUID;

import com.rohit.jobtracker.user.UserRole;

public record LoginResponse(
        UUID userId,
        String name,
        String email,
        UserRole role,
        String accessToken,
        String tokenType,
        long expiresIn,
        String message
) {
    public LoginResponse(
            UUID userId,
            String name,
            String email,
            UserRole role,
            String accessToken,
            long expiresIn,
            String message) {
        this(userId, name, email, role, accessToken, "Bearer", expiresIn, message);
    }
}
