package com.rohit.jobtracker.application;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID> {

    /** All applications for a user — paginated. */
    Page<JobApplication> findByUserId(UUID userId, Pageable pageable);

    /** Ownership-enforced single record lookup — returns empty if id doesn't belong to user. */
    Optional<JobApplication> findByIdAndUserId(UUID id, UUID userId);

    /** Filter by user + status. */
    Page<JobApplication> findByUserIdAndStatus(UUID userId, JobApplicationStatus status, Pageable pageable);

    /** Search by company name (case-insensitive) within user's applications. */
    Page<JobApplication> findByUserIdAndCompanyNameContainingIgnoreCase(
            UUID userId, String companyName, Pageable pageable);

    /**
     * Combined filter: optional status + optional company name search.
     * Null params are treated as "no filter" using JPQL coalesce trick.
     */
    @Query("""
            SELECT a FROM JobApplication a
            WHERE a.user.id = :userId
              AND (:status IS NULL OR a.status = :status)
              AND (:search IS NULL OR LOWER(a.companyName) LIKE LOWER(CONCAT('%', :search, '%')))
            ORDER BY a.createdAt DESC
            """)
    Page<JobApplication> findByUserIdWithFilters(
            @Param("userId") UUID userId,
            @Param("status") JobApplicationStatus status,
            @Param("search") String search,
            Pageable pageable);

    /** Count by user + status — used for dashboard stats. */
    long countByUserIdAndStatus(UUID userId, JobApplicationStatus status);

    /** Total count for a user. */
    long countByUserId(UUID userId);
}
