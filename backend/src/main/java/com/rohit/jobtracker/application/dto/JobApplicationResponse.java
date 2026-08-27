package com.rohit.jobtracker.application.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import com.rohit.jobtracker.application.JobApplication;
import com.rohit.jobtracker.application.JobApplicationStatus;

public record JobApplicationResponse(

        UUID id,
        UUID userId,
        String companyName,
        String jobTitle,
        String jobUrl,
        String location,
        String employmentType,
        JobApplicationStatus status,
        BigDecimal salaryMin,
        BigDecimal salaryMax,
        String notes,
        Instant appliedAt,
        Instant createdAt,
        Instant updatedAt
) {
    /** Convenience factory from entity — avoids exposing entity outside service layer. */
    public static JobApplicationResponse from(JobApplication app) {
        return new JobApplicationResponse(
                app.getId(),
                app.getUser().getId(),
                app.getCompanyName(),
                app.getJobTitle(),
                app.getJobUrl(),
                app.getLocation(),
                app.getEmploymentType(),
                app.getStatus(),
                app.getSalaryMin(),
                app.getSalaryMax(),
                app.getNotes(),
                app.getAppliedAt(),
                app.getCreatedAt(),
                app.getUpdatedAt()
        );
    }
}
