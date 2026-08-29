package com.rohit.jobtracker.application;

import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rohit.jobtracker.application.dto.JobApplicationRequest;
import com.rohit.jobtracker.application.dto.JobApplicationResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/applications")
public class JobApplicationController {

    private final JobApplicationService applicationService;

    public JobApplicationController(JobApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // ─── POST /api/v1/applications ─────────────────────────────────────────

    @PostMapping
    public ResponseEntity<JobApplicationResponse> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody JobApplicationRequest request) {

        JobApplicationResponse response = applicationService.create(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ─── GET /api/v1/applications ──────────────────────────────────────────

    @GetMapping
    public ResponseEntity<Page<JobApplicationResponse>> getAll(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        JobApplicationStatus statusEnum = null;
        if (status != null && !status.isBlank()) {
            try {
                statusEnum = JobApplicationStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status value: " + status);
            }
        }

        Page<JobApplicationResponse> result = applicationService.search(
                userDetails.getUsername(), search, statusEnum, pageable);

        return ResponseEntity.ok(result);
    }

    // ─── GET /api/v1/applications/stats ───────────────────────────────────

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(applicationService.getStats(userDetails.getUsername()));
    }

    // ─── GET /api/v1/applications/{id} ────────────────────────────────────

    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationResponse> getById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id) {

        return ResponseEntity.ok(applicationService.getById(userDetails.getUsername(), id));
    }

    // ─── PUT /api/v1/applications/{id} ────────────────────────────────────

    @PutMapping("/{id}")
    public ResponseEntity<JobApplicationResponse> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id,
            @Valid @RequestBody JobApplicationRequest request) {

        return ResponseEntity.ok(applicationService.update(userDetails.getUsername(), id, request));
    }

    // ─── PATCH /api/v1/applications/{id}/status ───────────────────────────

    @PatchMapping("/{id}/status")
    public ResponseEntity<JobApplicationResponse> updateStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id,
            @RequestParam String status) {

        JobApplicationStatus statusEnum;
        try {
            statusEnum = JobApplicationStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status value: " + status);
        }

        return ResponseEntity.ok(
                applicationService.updateStatus(userDetails.getUsername(), id, statusEnum));
    }

    // ─── DELETE /api/v1/applications/{id} ─────────────────────────────────

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id) {

        applicationService.delete(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
