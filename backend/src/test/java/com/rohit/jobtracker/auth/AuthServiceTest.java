package com.rohit.jobtracker.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import com.rohit.jobtracker.common.MessageResponse;
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
    void shouldRegisterUserSuccessfully() {
        RegisterRequest request = new RegisterRequest("Rohit Sharma", "rohit@example.com", "Password@123");
        User user = new User("Rohit Sharma", "rohit@example.com", "encodedHash");
        RefreshToken refreshToken = new RefreshToken(user, "refresh-123", Instant.now().plusSeconds(3600));

        when(userRepository.existsByEmail("rohit@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password@123")).thenReturn("encodedHash");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtService.generateToken(user)).thenReturn("access-jwt-token");
        when(jwtService.getExpirationTime()).thenReturn(900000L);
        when(refreshTokenService.createRefreshToken(user)).thenReturn(refreshToken);

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("rohit@example.com", response.email());
        assertEquals("access-jwt-token", response.accessToken());
        assertEquals("refresh-123", response.refreshToken());
    }

    @Test
    void shouldLoginUserSuccessfully() {
        LoginRequest request = new LoginRequest("rohit@example.com", "Password@123");
        User user = new User("Rohit Sharma", "rohit@example.com", "encodedHash");
        RefreshToken refreshToken = new RefreshToken(user, "refresh-123", Instant.now().plusSeconds(3600));

        when(userRepository.findByEmail("rohit@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Password@123", "encodedHash")).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("access-jwt-token");
        when(jwtService.getExpirationTime()).thenReturn(900000L);
        when(refreshTokenService.createRefreshToken(user)).thenReturn(refreshToken);

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("rohit@example.com", response.email());
        assertEquals("access-jwt-token", response.accessToken());
        assertEquals("refresh-123", response.refreshToken());
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
    void shouldLogoutSuccessfullyAndRevokeToken() {
        LogoutRequest request = new LogoutRequest("refresh-token-to-delete");

        MessageResponse response = authService.logout(request);

        assertNotNull(response);
        assertEquals("Logged out successfully", response.message());
        verify(refreshTokenService).deleteByToken("refresh-token-to-delete");
    }
}
