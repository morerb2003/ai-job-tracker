package com.rohit.jobtracker.user;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class AdminUserControllerTest {

    private UserRepository userRepository;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        AdminUserController controller = new AdminUserController(userRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void shouldReturnAllUsersForAdmin() throws Exception {
        User user1 = new User("Rohit Admin", "admin@example.com", "hash");
        user1.setRole(UserRole.ADMIN);
        User user2 = new User("John User", "john@example.com", "hash");

        when(userRepository.findAll()).thenReturn(List.of(user1, user2));

        mockMvc.perform(get("/api/v1/admin/users")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].email").value("admin@example.com"))
                .andExpect(jsonPath("$[0].role").value("ADMIN"))
                .andExpect(jsonPath("$[1].email").value("john@example.com"))
                .andExpect(jsonPath("$[1].role").value("USER"));
    }
}
