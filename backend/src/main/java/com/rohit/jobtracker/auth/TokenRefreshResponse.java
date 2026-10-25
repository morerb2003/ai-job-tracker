package com.rohit.jobtracker.auth;

public record TokenRefreshResponse(
        String accessToken,
        String tokenType,
        long expiresIn,
        String message
) {
    public TokenRefreshResponse(String accessToken, long expiresIn, String message) {
        this(accessToken, "Bearer", expiresIn, message);
    }
}
