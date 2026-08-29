package com.rohit.jobtracker.application;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rohit.jobtracker.application.dto.JobApplicationRequest;
import com.rohit.jobtracker.application.dto.JobApplicationResponse;
import com.rohit.jobtracker.exception.ResourceNotFoundException;
import com.rohit.jobtracker.user.User;
import com.rohit.jobtracker.user.UserRepository;

@Service
@Transactional(readOnly = true)
public class JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public JobApplicationService(JobApplicationRepository applicationRepository,
                                  UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    // ────────────────────────────────────────────────────────────────────────
    // CREATE
    // ────────────────────────────────────────────────────────────────────────

    @Transactional
    public JobApplicationResponse create(String userEmail, JobApplicationRequest request) {
        User user = resolveUser(userEmail);

        JobApplication app = new JobApplication(user, request.companyName(), request.jobTitle());
        applyFields(app, request);

        return JobApplicationResponse.from(applicationRepository.save(app));
    }

    // ────────────────────────────────────────────────────────────────────────
    // READ — list with filters
    // ────────────────────────────────────────────────────────────────────────

    public Page<JobApplicationResponse> getAll(String userEmail, Pageable pageable) {
        User user = resolveUser(userEmail);
        return applicationRepository
                .findByUserId(user.getId(), pageable)
                .map(JobApplicationResponse::from);
    }

    public Page<JobApplicationResponse> search(
            String userEmail,
            String companyName,
            JobApplicationStatus status,
            Pageable pageable) {

        User user = resolveUser(userEmail);

        // Blank strings should be treated as null (no filter)
        String searchTerm = (companyName != null && !companyName.isBlank()) ? companyName : null;

        return applicationRepository
                .findByUserIdWithFilters(user.getId(), status, searchTerm, pageable)
                .map(JobApplicationResponse::from);
    }

    // ────────────────────────────────────────────────────────────────────────
    // READ — single
    // ────────────────────────────────────────────────────────────────────────

    public JobApplicationResponse getById(String userEmail, UUID id) {
        User user = resolveUser(userEmail);
        JobApplication app = findOwnedOrThrow(id, user.getId());
        return JobApplicationResponse.from(app);
    }

    // ────────────────────────────────────────────────────────────────────────
    // UPDATE — full
    // ────────────────────────────────────────────────────────────────────────

    @Transactional
    public JobApplicationResponse update(String userEmail, UUID id, JobApplicationRequest request) {
        User user = resolveUser(userEmail);
        JobApplication app = findOwnedOrThrow(id, user.getId());
        applyFields(app, request);
        return JobApplicationResponse.from(applicationRepository.save(app));
    }

    // ────────────────────────────────────────────────────────────────────────
    // UPDATE — status only
    // ────────────────────────────────────────────────────────────────────────

    @Transactional
    public JobApplicationResponse updateStatus(String userEmail, UUID id, JobApplicationStatus status) {
        User user = resolveUser(userEmail);
        JobApplication app = findOwnedOrThrow(id, user.getId());
        app.setStatus(status);
        return JobApplicationResponse.from(applicationRepository.save(app));
    }

    // ────────────────────────────────────────────────────────────────────────
    // DELETE
    // ────────────────────────────────────────────────────────────────────────

    @Transactional
    public void delete(String userEmail, UUID id) {
        User user = resolveUser(userEmail);
        JobApplication app = findOwnedOrThrow(id, user.getId());
        applicationRepository.delete(app);
    }

    // ────────────────────────────────────────────────────────────────────────
    // STATS — for dashboard
    // ────────────────────────────────────────────────────────────────────────

    public Map<String, Long> getStats(String userEmail) {
        User user = resolveUser(userEmail);
        UUID userId = user.getId();

        Map<String, Long> result = new LinkedHashMap<>();
        result.put("total", applicationRepository.countByUserId(userId));
        for (JobApplicationStatus s : JobApplicationStatus.values()) {
            result.put(s.name(), applicationRepository.countByUserIdAndStatus(userId, s));
        }
        return result;
    }

    // ────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ────────────────────────────────────────────────────────────────────────

    private User resolveUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", email));
    }

    private JobApplication findOwnedOrThrow(UUID id, UUID userId) {
        return applicationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("JobApplication", id));
    }

    private void applyFields(JobApplication app, JobApplicationRequest req) {
        app.setCompanyName(req.companyName());
        app.setJobTitle(req.jobTitle());
        app.setJobUrl(req.jobUrl());
        app.setLocation(req.location());
        app.setEmploymentType(req.employmentType());
        if (req.status() != null) {
            app.setStatus(req.status());
        }
        app.setSalaryMin(req.salaryMin());
        app.setSalaryMax(req.salaryMax());
        app.setNotes(req.notes());
        app.setAppliedAt(req.appliedAt());
    }
}
