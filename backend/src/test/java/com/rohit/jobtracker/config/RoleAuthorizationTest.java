package com.rohit.jobtracker.config;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import com.rohit.jobtracker.security.JwtAuthenticationFilter;
import com.rohit.jobtracker.security.JwtService;
import com.rohit.jobtracker.user.AdminUserController;
import com.rohit.jobtracker.user.User;
import com.rohit.jobtracker.user.UserRepository;
import com.rohit.jobtracker.user.UserRole;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(AdminUserController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class RoleAuthorizationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @Test
    void unauthenticatedRequestToProtectedApiReturns401() throws Exception {
        mockMvc.perform(get("/api/v1/applications/stats"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void userRoleCannotAccessAdminDirectory() throws Exception {
        mockMvc.perform(get("/api/v1/admin/users")
                        .with(user("user@example.com").roles("USER")))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminRoleCanAccessAdminDirectory() throws Exception {
        User admin = new User("Admin", "admin@example.com", "hash");
        admin.setRole(UserRole.ADMIN);
        when(userRepository.findAll()).thenReturn(List.of(admin));

        mockMvc.perform(get("/api/v1/admin/users")
                        .with(user("admin@example.com").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("admin@example.com"))
                .andExpect(jsonPath("$[0].role").value("ADMIN"))
                .andExpect(jsonPath("$[0].password").doesNotExist());
    }
}
