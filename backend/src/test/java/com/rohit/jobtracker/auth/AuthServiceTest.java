package com.rohit.jobtracker.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import com.rohit.jobtracker.security.JwtService;
import com.rohit.jobtracker.user.User;
import com.rohit.jobtracker.user.UserRepository;

class AuthServiceTest {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private RefreshTokenService refreshTokenService;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtService = mock(JwtService.class);
        refreshTokenService = mock(RefreshTokenService.class);
        authService = new AuthService(userRepository, passwordEncoder, jwtService, refreshTokenService);
    }

    @Test
    void registrationKeepsRefreshCredentialOutOfResponseBody() {
        RegisterRequest request = new RegisterRequest("Rohit Sharma", "rohit@example.com", "Password@123");
        User user = new User("Rohit Sharma", "rohit@example.com", "encodedHash");

        when(userRepository.existsByEmail("rohit@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password@123")).thenReturn("encodedHash");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtService.generateToken(user)).thenReturn("access-jwt-token");
        when(jwtService.getExpirationTime()).thenReturn(900000L);
        when(refreshTokenService.createRefreshToken(user)).thenReturn("opaque-refresh-cookie-value");

        AuthSessionResult<AuthResponse> result = authService.register(request);

        assertNotNull(result);
        assertEquals("rohit@example.com", result.response().email());
        assertEquals("access-jwt-token", result.response().accessToken());
        assertEquals("opaque-refresh-cookie-value", result.refreshToken());
    }

    @Test
    void loginReturnsAccessTokenAndCookieCredentialSeparately() {
        LoginRequest request = new LoginRequest("rohit@example.com", "Password@123");
        User user = new User("Rohit Sharma", "rohit@example.com", "encodedHash");

        when(userRepository.findByEmail("rohit@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Password@123", "encodedHash")).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("access-jwt-token");
        when(jwtService.getExpirationTime()).thenReturn(900000L);
        when(refreshTokenService.createRefreshToken(user)).thenReturn("opaque-refresh-cookie-value");

        AuthSessionResult<LoginResponse> result = authService.login(request);

        assertEquals("rohit@example.com", result.response().email());
        assertEquals("access-jwt-token", result.response().accessToken());
        assertEquals("opaque-refresh-cookie-value", result.refreshToken());
    }

    @Test
    void shouldRejectLoginWithWrongPassword() {
        LoginRequest request = new LoginRequest("rohit@example.com", "WrongPassword");
        User user = new User("Rohit Sharma", "rohit@example.com", "encodedHash");

        when(userRepository.findByEmail("rohit@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("WrongPassword", "encodedHash")).thenReturn(false);

        assertThrows(ResponseStatusException.class, () -> authService.login(request));
    }

    @Test
    void logoutRevokesTheCookieRefreshCredential() {
        authService.logout("opaque-refresh-cookie-value");
        verify(refreshTokenService).revokeToken("opaque-refresh-cookie-value");
    }
}
