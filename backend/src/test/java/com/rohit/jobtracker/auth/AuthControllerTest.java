package com.rohit.jobtracker.auth;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rohit.jobtracker.common.MessageResponse;
import com.rohit.jobtracker.user.UserRole;

class AuthControllerTest {

    private AuthService authService;
    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        authService = mock(AuthService.class);
        AuthController authController = new AuthController(authService);
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void shouldRegisterUserSuccessfully() throws Exception {
        RegisterRequest request = new RegisterRequest("Rohit Sharma", "rohit@example.com", "Password@123");
        AuthResponse response = new AuthResponse(
                UUID.randomUUID(),
                "Rohit Sharma",
                "rohit@example.com",
                UserRole.USER,
                "jwt-access-token",
                "jwt-refresh-token",
                900000L,
                "Registration successful"
        );

        when(authService.register(any(RegisterRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("rohit@example.com"))
                .andExpect(jsonPath("$.accessToken").value("jwt-access-token"))
                .andExpect(jsonPath("$.refreshToken").value("jwt-refresh-token"));
    }

    @Test
    void shouldLoginUserSuccessfully() throws Exception {
        LoginRequest request = new LoginRequest("rohit@example.com", "Password@123");
        LoginResponse response = new LoginResponse(
                UUID.randomUUID(),
                "Rohit Sharma",
                "rohit@example.com",
                UserRole.USER,
                "jwt-access-token",
                "jwt-refresh-token",
                900000L,
                "Login successful"
        );

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("jwt-access-token"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }

    @Test
    void shouldRefreshTokenSuccessfully() throws Exception {
        RefreshTokenRequest request = new RefreshTokenRequest("valid-refresh-token");
        TokenRefreshResponse response = new TokenRefreshResponse(
                "new-access-token",
                "new-rotated-refresh-token",
                900000L,
                "Token refreshed successfully"
        );

        when(authService.refreshToken(any(RefreshTokenRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("new-access-token"))
                .andExpect(jsonPath("$.refreshToken").value("new-rotated-refresh-token"));
    }

    @Test
    void shouldLogoutUserSuccessfully() throws Exception {
        LogoutRequest request = new LogoutRequest("refresh-token-to-delete");
        MessageResponse response = new MessageResponse("Logged out successfully");

        when(authService.logout(any(LogoutRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logged out successfully"));
    }
}
