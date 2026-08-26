package com.rohit.jobtracker.auth;

public record LogoutRequest(
        String refreshToken
) {
}
