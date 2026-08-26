package com.rohit.jobtracker.auth;

import java.time.Instant;
import java.util.UUID;

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

    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository,
            @Value("${jwt.refresh-expiration:604800000}") long refreshExpirationMs) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.refreshExpirationMs = refreshExpirationMs;
    }

    @Transactional
    public RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = new RefreshToken(
                user,
                UUID.randomUUID().toString(),
                Instant.now().plusMillis(refreshExpirationMs)
        );
        return refreshTokenRepository.save(refreshToken);
    }

    @Transactional
    public RefreshToken rotateRefreshToken(String rawToken) {
        RefreshToken token = refreshTokenRepository.findByToken(rawToken)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        if (token.isRevoked() || token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token has expired or been revoked");
        }

        User user = token.getUser();
        // Delete old refresh token to enforce rotation
        refreshTokenRepository.delete(token);

        // Generate new refresh token
        return createRefreshToken(user);
    }

    @Transactional
    public void revokeToken(String rawToken) {
        refreshTokenRepository.findByToken(rawToken).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    @Transactional
    public void deleteByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }

    @Transactional
    public void deleteByToken(String token) {
        refreshTokenRepository.deleteByToken(token);
    }

    public long getRefreshExpirationMs() {
        return refreshExpirationMs;
    }
}
