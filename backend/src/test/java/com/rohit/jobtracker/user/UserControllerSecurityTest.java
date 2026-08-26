package com.rohit.jobtracker.user;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.security.Principal;
import java.time.Instant;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class UserControllerSecurityTest {

    private UserService userService;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        userService = mock(UserService.class);
        UserController userController = new UserController(userService);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    void shouldRejectUnauthenticatedRequestWhenPrincipalIsNull() throws Exception {
        mockMvc.perform(get("/api/v1/users/me")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldReturnProfileWhenPrincipalIsPresent() throws Exception {
        String email = "rohit@example.com";
        UUID userId = UUID.randomUUID();
        Principal principal = () -> email;

        when(userService.getCurrentUserProfile(email)).thenReturn(
                new UserProfileResponse(
                        userId,
                        "Rohit Sharma",
                        email,
                        UserRole.USER,
                        Instant.now(),
                        Instant.now()
                )
        );

        mockMvc.perform(get("/api/v1/users/me")
                        .principal(principal)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.name").value("Rohit Sharma"))
                .andExpect(jsonPath("$.role").value("USER"));
    }
}
