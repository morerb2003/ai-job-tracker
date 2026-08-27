package com.rohit.jobtracker.auth;

public record TokenRefreshResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresIn,
        String message
) {
    public TokenRefreshResponse(String accessToken, String refreshToken, long expiresIn, String message) {
        this(accessToken, refreshToken, "Bearer", expiresIn, message);
    }
}
