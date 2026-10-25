package com.rohit.jobtracker.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.rohit.jobtracker.user.User;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final long refreshExpirationMs;
    private final SecureRandom secureRandom = new SecureRandom();

    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository,
            @Value("${jwt.refresh-expiration:604800000}") long refreshExpirationMs) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.refreshExpirationMs = refreshExpirationMs;
    }

    @Transactional
    public String createRefreshToken(User user) {
        Instant now = Instant.now();
        refreshTokenRepository.deleteExpiredBefore(now);

        String rawToken = generateRawToken();
        RefreshToken refreshToken = new RefreshToken(
                user,
                hashToken(rawToken),
                now.plusMillis(refreshExpirationMs));
        refreshTokenRepository.save(refreshToken);
        return rawToken;
    }

    @Transactional
    public RotatedRefreshToken rotateRefreshToken(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw invalidRefreshToken();
        }

        RefreshToken token = refreshTokenRepository.findByTokenHash(hashToken(rawToken.trim()))
                .orElseThrow(this::invalidRefreshToken);

        if (token.isRevoked() || token.getExpiryDate().isBefore(Instant.now())) {
            throw invalidRefreshToken();
        }

        token.setRevoked(true);
        refreshTokenRepository.save(token);
        String nextRawToken = createRefreshToken(token.getUser());
        return new RotatedRefreshToken(token.getUser(), nextRawToken);
    }

    @Transactional
    public void revokeToken(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            return;
        }

        refreshTokenRepository.findByTokenHash(hashToken(rawToken.trim())).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    static String hashToken(String rawToken) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }

    private String generateRawToken() {
        byte[] tokenBytes = new byte[32];
        secureRandom.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }

    private ResponseStatusException invalidRefreshToken() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token is invalid or expired");
    }

    public long getRefreshExpirationMs() {
        return refreshExpirationMs;
    }
}
