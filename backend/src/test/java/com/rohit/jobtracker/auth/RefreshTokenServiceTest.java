package com.rohit.jobtracker.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import com.rohit.jobtracker.user.User;

class RefreshTokenServiceTest {

    private RefreshTokenRepository repository;
    private RefreshTokenService service;
    private final long expirationMs = 604800000L; // 7 days

    @BeforeEach
    void setUp() {
        repository = mock(RefreshTokenRepository.class);
        service = new RefreshTokenService(repository, expirationMs);
    }

    @Test
    void shouldCreateRefreshToken() {
        User user = new User("Rohit", "rohit@example.com", "hash");
        when(repository.save(any(RefreshToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RefreshToken token = service.createRefreshToken(user);

        assertNotNull(token);
        assertNotNull(token.getToken());
        assertEquals(user, token.getUser());
        verify(repository).save(any(RefreshToken.class));
    }

    @Test
    void shouldRotateRefreshTokenSuccessfully() {
        User user = new User("Rohit", "rohit@example.com", "hash");
        String oldRawToken = "old-token-123";
        RefreshToken existingToken = new RefreshToken(user, oldRawToken, Instant.now().plusSeconds(3600));

        when(repository.findByToken(oldRawToken)).thenReturn(Optional.of(existingToken));
        when(repository.save(any(RefreshToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RefreshToken rotated = service.rotateRefreshToken(oldRawToken);

        assertNotNull(rotated);
        verify(repository).delete(existingToken);
        verify(repository).save(any(RefreshToken.class));
    }

    @Test
    void shouldRejectExpiredRefreshToken() {
        User user = new User("Rohit", "rohit@example.com", "hash");
        String expiredRawToken = "expired-token-123";
        RefreshToken existingToken = new RefreshToken(user, expiredRawToken, Instant.now().minusSeconds(3600));

        when(repository.findByToken(expiredRawToken)).thenReturn(Optional.of(existingToken));

        assertThrows(ResponseStatusException.class, () -> service.rotateRefreshToken(expiredRawToken));
        verify(repository).delete(existingToken);
    }
}
