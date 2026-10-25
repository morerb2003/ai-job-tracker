package com.rohit.jobtracker.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import com.rohit.jobtracker.application.dto.JobApplicationRequest;
import com.rohit.jobtracker.application.dto.JobApplicationResponse;
import com.rohit.jobtracker.exception.ResourceNotFoundException;
import com.rohit.jobtracker.user.User;
import com.rohit.jobtracker.user.UserRepository;

class JobApplicationServiceTest {

    private JobApplicationRepository applicationRepository;
    private UserRepository userRepository;
    private JobApplicationService service;

    private User testUser;
    private JobApplication testApp;
    private static final String TEST_EMAIL = "test@example.com";

    @BeforeEach
    void setUp() {
        applicationRepository = mock(JobApplicationRepository.class);
        userRepository = mock(UserRepository.class);
        service = new JobApplicationService(applicationRepository, userRepository);

        testUser = new User("Test User", TEST_EMAIL, "hashed-password");
        ReflectionTestUtils.setField(testUser, "id", UUID.randomUUID());
        testApp = new JobApplication(testUser, "Google", "Software Engineer");

        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testUser));
    }

    @Test
    void create_shouldSaveAndReturnResponse() {
        JobApplicationRequest request = new JobApplicationRequest(
                "Google", "Software Engineer", "https://careers.google.com",
                "Remote", "Full-time", JobApplicationStatus.SAVED,
                null, null, null, null
        );

        when(applicationRepository.save(any(JobApplication.class))).thenReturn(testApp);

        JobApplicationResponse response = service.create(TEST_EMAIL, request);

        assertThat(response.companyName()).isEqualTo("Google");
        assertThat(response.jobTitle()).isEqualTo("Software Engineer");
        ArgumentCaptor<JobApplication> savedApplication = ArgumentCaptor.forClass(JobApplication.class);
        verify(applicationRepository).save(savedApplication.capture());
        assertThat(savedApplication.getValue().getUser()).isSameAs(testUser);
    }

    @Test
    void getAll_shouldReturnPagedResults() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<JobApplication> page = new PageImpl<>(List.of(testApp), pageable, 1);

        when(applicationRepository.findByUserId(testUser.getId(), pageable)).thenReturn(page);

        Page<JobApplicationResponse> result = service.getAll(TEST_EMAIL, pageable);

        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).companyName()).isEqualTo("Google");
        verify(applicationRepository).findByUserId(testUser.getId(), pageable);
    }

    @Test
    void search_shouldScopeFilteredResultsToCurrentUser() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<JobApplication> page = new PageImpl<>(List.of(testApp), pageable, 1);
        when(applicationRepository.findByUserIdWithFilters(testUser.getId(), null, "Google", pageable))
                .thenReturn(page);

        Page<JobApplicationResponse> result = service.search(TEST_EMAIL, "Google", null, pageable);

        assertThat(result.getContent()).hasSize(1);
        verify(applicationRepository).findByUserIdWithFilters(testUser.getId(), null, "Google", pageable);
    }

    @Test
    void getById_ownedByUser_shouldReturnResponse() {
        UUID appId = UUID.randomUUID();
        when(applicationRepository.findByIdAndUserId(appId, testUser.getId()))
                .thenReturn(Optional.of(testApp));

        JobApplicationResponse response = service.getById(TEST_EMAIL, appId);

        assertThat(response.companyName()).isEqualTo("Google");
    }

    @Test
    void getById_notOwnedByUser_shouldThrow404() {
        UUID appId = UUID.randomUUID();
        when(applicationRepository.findByIdAndUserId(appId, testUser.getId()))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getById(TEST_EMAIL, appId))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void update_shouldUpdateAllFieldsAndReturn() {
        UUID appId = UUID.randomUUID();
        JobApplicationRequest request = new JobApplicationRequest(
                "Meta", "Senior Engineer", null, "NYC", "Full-time",
                JobApplicationStatus.APPLIED, null, null, "Updated notes", null
        );

        when(applicationRepository.findByIdAndUserId(appId, testUser.getId()))
                .thenReturn(Optional.of(testApp));
        when(applicationRepository.save(testApp)).thenReturn(testApp);

        JobApplicationResponse response = service.update(TEST_EMAIL, appId, request);

        assertThat(response.companyName()).isEqualTo("Meta");
        assertThat(response.jobTitle()).isEqualTo("Senior Engineer");
        verify(applicationRepository).save(testApp);
    }

    @Test
    void update_notOwnedByUser_shouldNotSaveApplication() {
        UUID appId = UUID.randomUUID();
        JobApplicationRequest request = new JobApplicationRequest(
                "Other Company", "Other Role", null, null, null,
                JobApplicationStatus.APPLIED, null, null, null, null);
        when(applicationRepository.findByIdAndUserId(appId, testUser.getId()))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.update(TEST_EMAIL, appId, request))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(applicationRepository).findByIdAndUserId(appId, testUser.getId());
    }

    @Test
    void updateStatus_shouldChangeStatusAndReturn() {
        UUID appId = UUID.randomUUID();

        when(applicationRepository.findByIdAndUserId(appId, testUser.getId()))
                .thenReturn(Optional.of(testApp));
        when(applicationRepository.save(testApp)).thenReturn(testApp);

        JobApplicationResponse response = service.updateStatus(TEST_EMAIL, appId, JobApplicationStatus.INTERVIEWING);

        assertThat(response.status()).isEqualTo(JobApplicationStatus.INTERVIEWING);
        verify(applicationRepository).save(testApp);
    }

    @Test
    void updateStatus_notOwnedByUser_shouldNotSaveApplication() {
        UUID appId = UUID.randomUUID();
        when(applicationRepository.findByIdAndUserId(appId, testUser.getId()))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.updateStatus(TEST_EMAIL, appId, JobApplicationStatus.INTERVIEWING))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(applicationRepository).findByIdAndUserId(appId, testUser.getId());
    }

    @Test
    void delete_shouldRemoveApplication() {
        UUID appId = UUID.randomUUID();

        when(applicationRepository.findByIdAndUserId(appId, testUser.getId()))
                .thenReturn(Optional.of(testApp));

        service.delete(TEST_EMAIL, appId);

        verify(applicationRepository).delete(testApp);
    }

    @Test
    void delete_notFound_shouldThrow404() {
        UUID appId = UUID.randomUUID();
        when(applicationRepository.findByIdAndUserId(appId, testUser.getId()))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.delete(TEST_EMAIL, appId))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void delete_notOwnedByUser_shouldNotDeleteApplication() {
        UUID appId = UUID.randomUUID();
        when(applicationRepository.findByIdAndUserId(appId, testUser.getId()))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.delete(TEST_EMAIL, appId))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(applicationRepository).findByIdAndUserId(appId, testUser.getId());
    }

    @Test
    void getStats_shouldReturnCountsForAllStatuses() {
        when(applicationRepository.countByUserId(testUser.getId())).thenReturn(5L);
        when(applicationRepository.countByUserIdAndStatus(eq(testUser.getId()), any())).thenReturn(1L);

        var stats = service.getStats(TEST_EMAIL);

        assertThat(stats).containsKey("total");
        assertThat(stats).containsKey("SAVED");
        assertThat(stats).containsKey("APPLIED");
        assertThat(stats).containsKey("INTERVIEWING");
        assertThat(stats.get("total")).isEqualTo(5L);
        verify(applicationRepository).countByUserId(testUser.getId());
        verify(applicationRepository, org.mockito.Mockito.times(JobApplicationStatus.values().length))
                .countByUserIdAndStatus(eq(testUser.getId()), any());
    }
}
