package com.rohit.jobtracker.auth;

/** Keeps the refresh credential out of JSON responses so controllers can set it as an HttpOnly cookie. */
public record AuthSessionResult<T>(T response, String refreshToken) {
}
