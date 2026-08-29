package com.rohit.jobtracker.application.dto;

import java.math.BigDecimal;
import java.time.Instant;

import com.rohit.jobtracker.application.JobApplicationStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record JobApplicationRequest(

        @NotBlank(message = "Company name is required")
        @Size(max = 160, message = "Company name must be 160 characters or fewer")
        String companyName,

        @NotBlank(message = "Job title is required")
        @Size(max = 180, message = "Job title must be 180 characters or fewer")
        String jobTitle,

        String jobUrl,

        @Size(max = 180)
        String location,

        @Size(max = 80)
        String employmentType,

        JobApplicationStatus status,

        BigDecimal salaryMin,

        BigDecimal salaryMax,

        String notes,

        Instant appliedAt
) {
}
