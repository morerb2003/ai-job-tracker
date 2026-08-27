package com.rohit.jobtracker.application;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.rohit.jobtracker.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "job_applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "company_name", nullable = false, length = 160)
    private String companyName;

    @Column(name = "job_title", nullable = false, length = 180)
    private String jobTitle;

    @Column(name = "job_url", columnDefinition = "TEXT")
    private String jobUrl;

    @Column(name = "location", length = 180)
    private String location;

    @Column(name = "employment_type", length = 80)
    private String employmentType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private JobApplicationStatus status = JobApplicationStatus.SAVED;

    @Column(name = "salary_min", precision = 12, scale = 2)
    private BigDecimal salaryMin;

    @Column(name = "salary_max", precision = 12, scale = 2)
    private BigDecimal salaryMax;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "applied_at")
    private Instant appliedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected JobApplication() {
    }

    public JobApplication(User user, String companyName, String jobTitle) {
        this.user = user;
        this.companyName = companyName;
        this.jobTitle = jobTitle;
    }

    // --- Getters ---

    public UUID getId() { return id; }

    public User getUser() { return user; }

    public String getCompanyName() { return companyName; }

    public String getJobTitle() { return jobTitle; }

    public String getJobUrl() { return jobUrl; }

    public String getLocation() { return location; }

    public String getEmploymentType() { return employmentType; }

    public JobApplicationStatus getStatus() { return status; }

    public BigDecimal getSalaryMin() { return salaryMin; }

    public BigDecimal getSalaryMax() { return salaryMax; }

    public String getNotes() { return notes; }

    public Instant getAppliedAt() { return appliedAt; }

    public Instant getCreatedAt() { return createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }

    // --- Setters ---

    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public void setJobUrl(String jobUrl) { this.jobUrl = jobUrl; }

    public void setLocation(String location) { this.location = location; }

    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }

    public void setStatus(JobApplicationStatus status) { this.status = status; }

    public void setSalaryMin(BigDecimal salaryMin) { this.salaryMin = salaryMin; }

    public void setSalaryMax(BigDecimal salaryMax) { this.salaryMax = salaryMax; }

    public void setNotes(String notes) { this.notes = notes; }

    public void setAppliedAt(Instant appliedAt) { this.appliedAt = appliedAt; }
}
