package com.rohit.jobtracker.auth;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rohit.jobtracker.common.MessageResponse;
import com.rohit.jobtracker.user.UserRole;

import jakarta.servlet.http.Cookie;

class AuthControllerTest {

    private static final String REFRESH_COOKIE = "jobtracker_refresh";

    private AuthService authService;
    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        authService = mock(AuthService.class);
        AuthController authController = new AuthController(authService, 604800000L, false, "Lax");
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void registerReturnsAccessTokenAndSetsHttpOnlyRefreshCookie() throws Exception {
        RegisterRequest request = new RegisterRequest("Rohit Sharma", "rohit@example.com", "Password@123");
        AuthResponse response = new AuthResponse(
                UUID.randomUUID(), "Rohit Sharma", "rohit@example.com", UserRole.USER,
                "jwt-access-token", "Bearer", 900000L, "Registration successful");
        when(authService.register(any(RegisterRequest.class)))
                .thenReturn(new AuthSessionResult<>(response, "opaque-refresh-token"));

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("rohit@example.com"))
                .andExpect(jsonPath("$.accessToken").value("jwt-access-token"))
                .andExpect(jsonPath("$.refreshToken").doesNotExist())
                .andExpect(header().string("Set-Cookie", Matchers.containsString("HttpOnly")))
                .andExpect(header().string("Set-Cookie", Matchers.containsString("Path=/api/v1/auth")));
    }

    @Test
    void loginSetsRefreshCookieWithoutReturningItInJson() throws Exception {
        LoginRequest request = new LoginRequest("rohit@example.com", "Password@123");
        LoginResponse response = new LoginResponse(
                UUID.randomUUID(), "Rohit Sharma", "rohit@example.com", UserRole.USER,
                "jwt-access-token", "Bearer", 900000L, "Login successful");
        when(authService.login(any(LoginRequest.class)))
                .thenReturn(new AuthSessionResult<>(response, "opaque-refresh-token"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("jwt-access-token"))
                .andExpect(jsonPath("$.refreshToken").doesNotExist())
                .andExpect(header().string("Set-Cookie", Matchers.containsString("HttpOnly")));
    }

    @Test
    void refreshRotatesHttpOnlyCookieAndReturnsOnlyAccessToken() throws Exception {
        TokenRefreshResponse response = new TokenRefreshResponse(
                "new-access-token", 900000L, "Token refreshed successfully");
        when(authService.refreshToken("valid-refresh-token"))
                .thenReturn(new AuthSessionResult<>(response, "new-opaque-refresh-token"));

        mockMvc.perform(post("/api/v1/auth/refresh")
                        .cookie(new Cookie(REFRESH_COOKIE, "valid-refresh-token")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("new-access-token"))
                .andExpect(jsonPath("$.refreshToken").doesNotExist())
                .andExpect(header().string("Set-Cookie", Matchers.containsString("HttpOnly")));
    }

    @Test
    void logoutRevokesCookieAndExpiresItInBrowser() throws Exception {
        MessageResponse response = new MessageResponse("Logged out successfully");
        when(authService.logout("opaque-refresh-token")).thenReturn(response);

        mockMvc.perform(post("/api/v1/auth/logout")
                        .cookie(new Cookie(REFRESH_COOKIE, "opaque-refresh-token")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logged out successfully"))
                .andExpect(header().string("Set-Cookie", Matchers.containsString("Max-Age=0")))
                .andExpect(header().string("Set-Cookie", Matchers.containsString("HttpOnly")));
    }
}
