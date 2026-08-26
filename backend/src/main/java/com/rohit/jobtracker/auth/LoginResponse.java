package com.rohit.jobtracker.auth;

import java.util.UUID;

import com.rohit.jobtracker.user.UserRole;

public record LoginResponse(
        UUID userId,
        String name,
        String email,
        UserRole role,
        String message
) {
}
