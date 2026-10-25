package com.rohit.jobtracker.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.web.server.ResponseStatusException;

import com.rohit.jobtracker.user.User;

class RefreshTokenServiceTest {

    private RefreshTokenRepository repository;
    private RefreshTokenService service;
    private final long expirationMs = 604800000L;

    @BeforeEach
    void setUp() {
        repository = mock(RefreshTokenRepository.class);
        service = new RefreshTokenService(repository, expirationMs);
    }

    @Test
    void storesOnlyHashOfHighEntropyRefreshToken() {
        User user = new User("Rohit", "rohit@example.com", "hash");
        when(repository.save(any(RefreshToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String rawToken = service.createRefreshToken(user);

        ArgumentCaptor<RefreshToken> savedToken = ArgumentCaptor.forClass(RefreshToken.class);
        verify(repository).save(savedToken.capture());
        assertNotNull(rawToken);
        assertEquals(43, rawToken.length());
        assertEquals(64, savedToken.getValue().getTokenHash().length());
        assertNotEquals(rawToken, savedToken.getValue().getTokenHash());
        assertEquals(RefreshTokenService.hashToken(rawToken), savedToken.getValue().getTokenHash());
        assertEquals(user, savedToken.getValue().getUser());
    }

    @Test
    void rotatesRefreshTokenAndRevokesThePreviousHash() {
        User user = new User("Rohit", "rohit@example.com", "hash");
        String oldRawToken = "old-token-123";
        RefreshToken existingToken = new RefreshToken(
                user,
                RefreshTokenService.hashToken(oldRawToken),
                Instant.now().plusSeconds(3600));

        when(repository.findByTokenHash(RefreshTokenService.hashToken(oldRawToken)))
                .thenReturn(Optional.of(existingToken));
        when(repository.save(any(RefreshToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RotatedRefreshToken rotated = service.rotateRefreshToken(oldRawToken);

        assertEquals(user, rotated.user());
        assertNotNull(rotated.rawToken());
        assertNotEquals(oldRawToken, rotated.rawToken());
        assertEquals(true, existingToken.isRevoked());
        ArgumentCaptor<RefreshToken> savedTokens = ArgumentCaptor.forClass(RefreshToken.class);
        verify(repository, times(2)).save(savedTokens.capture());
        assertEquals(existingToken, savedTokens.getAllValues().get(0));
        assertEquals(true, savedTokens.getAllValues().get(0).isRevoked());
        assertNotEquals(
                RefreshTokenService.hashToken(oldRawToken),
                savedTokens.getAllValues().get(1).getTokenHash());
    }

    @Test
    void rejectsExpiredRefreshToken() {
        User user = new User("Rohit", "rohit@example.com", "hash");
        String expiredRawToken = "expired-token-123";
        RefreshToken existingToken = new RefreshToken(
                user,
                RefreshTokenService.hashToken(expiredRawToken),
                Instant.now().minusSeconds(3600));

        when(repository.findByTokenHash(RefreshTokenService.hashToken(expiredRawToken)))
                .thenReturn(Optional.of(existingToken));

        assertThrows(ResponseStatusException.class, () -> service.rotateRefreshToken(expiredRawToken));
    }
}
