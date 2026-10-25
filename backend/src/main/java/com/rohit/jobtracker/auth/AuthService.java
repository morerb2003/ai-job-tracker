package com.rohit.jobtracker.auth;

import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.server.ResponseStatusException;

import com.rohit.jobtracker.security.JwtService;
import com.rohit.jobtracker.user.User;
import com.rohit.jobtracker.user.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    @Transactional
    public AuthSessionResult<AuthResponse> register(RegisterRequest request) {
        String email = normalizeEmail(request.email());

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }

        User user = new User(
                request.name().trim(),
                email,
                passwordEncoder.encode(request.password()));

        User savedUser;
        try {
            savedUser = userRepository.saveAndFlush(user);
        } catch (DataIntegrityViolationException exception) {
            // The unique email index remains the final guard against concurrent registrations.
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }
        String accessToken = jwtService.generateToken(savedUser);
        String refreshToken = refreshTokenService.createRefreshToken(savedUser);

        AuthResponse response = new AuthResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                accessToken,
                "Bearer",
                jwtService.getExpirationTime(),
                "Registration successful");
        return new AuthSessionResult<>(response, refreshToken);
    }

    @Transactional
    public AuthSessionResult<LoginResponse> login(LoginRequest request) {
        String email = normalizeEmail(request.email());

        User user = userRepository.findByEmail(email)
                .orElseThrow(this::invalidCredentials);

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw invalidCredentials();
        }

        String accessToken = jwtService.generateToken(user);
        String refreshToken = refreshTokenService.createRefreshToken(user);

        LoginResponse response = new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                accessToken,
                "Bearer",
                jwtService.getExpirationTime(),
                "Login successful");
        return new AuthSessionResult<>(response, refreshToken);
    }

    @Transactional
    public AuthSessionResult<TokenRefreshResponse> refreshToken(String rawRefreshToken) {
        RotatedRefreshToken rotatedToken = refreshTokenService.rotateRefreshToken(rawRefreshToken);
        User user = rotatedToken.user();
        String newAccessToken = jwtService.generateToken(user);

        TokenRefreshResponse response = new TokenRefreshResponse(
                newAccessToken,
                jwtService.getExpirationTime(),
                "Token refreshed successfully");
        return new AuthSessionResult<>(response, rotatedToken.rawToken());
    }

    @Transactional
    public com.rohit.jobtracker.common.MessageResponse logout(String refreshToken) {
        refreshTokenService.revokeToken(refreshToken);
        return new com.rohit.jobtracker.common.MessageResponse("Logged out successfully");
    }

    private ResponseStatusException invalidCredentials() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
