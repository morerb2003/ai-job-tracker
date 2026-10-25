package com.rohit.jobtracker.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.time.Duration;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private static final String REFRESH_COOKIE_NAME = "jobtracker_refresh";
    private static final String REFRESH_COOKIE_PATH = "/api/v1/auth";

    private final AuthService authService;
    private final long refreshExpirationMs;
    private final boolean secureRefreshCookie;
    private final String refreshCookieSameSite;

    public AuthController(
            AuthService authService,
            @Value("${jwt.refresh-expiration:604800000}") long refreshExpirationMs,
            @Value("${auth.refresh-cookie.secure:false}") boolean secureRefreshCookie,
            @Value("${auth.refresh-cookie.same-site:Lax}") String refreshCookieSameSite) {
        this.authService = authService;
        this.refreshExpirationMs = refreshExpirationMs;
        this.secureRefreshCookie = secureRefreshCookie;
        this.refreshCookieSameSite = refreshCookieSameSite;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {
        AuthSessionResult<AuthResponse> session = authService.register(request);
        writeRefreshCookie(response, session.refreshToken());
        return session.response();
    }

    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        AuthSessionResult<LoginResponse> session = authService.login(request);
        writeRefreshCookie(response, session.refreshToken());
        return session.response();
    }

    @PostMapping("/refresh")
    public TokenRefreshResponse refreshToken(
            @CookieValue(name = REFRESH_COOKIE_NAME, required = false) String refreshToken,
            HttpServletResponse response) {
        AuthSessionResult<TokenRefreshResponse> session;
        try {
            session = authService.refreshToken(refreshToken);
        } catch (ResponseStatusException exception) {
            if (exception.getStatusCode().value() == HttpStatus.UNAUTHORIZED.value()) {
                clearRefreshCookie(response);
            }
            throw exception;
        }
        writeRefreshCookie(response, session.refreshToken());
        return session.response();
    }

    @PostMapping("/logout")
    public com.rohit.jobtracker.common.MessageResponse logout(
            @CookieValue(name = REFRESH_COOKIE_NAME, required = false) String refreshToken,
            HttpServletResponse response) {
        com.rohit.jobtracker.common.MessageResponse result = authService.logout(refreshToken);
        clearRefreshCookie(response);
        return result;
    }

    private void writeRefreshCookie(HttpServletResponse response, String refreshToken) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_COOKIE_NAME, refreshToken)
                .httpOnly(true)
                .secure(secureRefreshCookie)
                .sameSite(refreshCookieSameSite)
                .path(REFRESH_COOKIE_PATH)
                .maxAge(Duration.ofMillis(refreshExpirationMs))
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearRefreshCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(secureRefreshCookie)
                .sameSite(refreshCookieSameSite)
                .path(REFRESH_COOKIE_PATH)
                .maxAge(Duration.ZERO)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
