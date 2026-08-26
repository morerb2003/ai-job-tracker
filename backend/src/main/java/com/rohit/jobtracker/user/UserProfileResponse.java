package com.rohit.jobtracker.user;

import java.time.Instant;
import java.util.UUID;

public record UserProfileResponse(
        UUID id,
        String name,
        String email,
        UserRole role,
        Instant createdAt,
        Instant updatedAt
) {
    public static UserProfileResponse fromEntity(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
