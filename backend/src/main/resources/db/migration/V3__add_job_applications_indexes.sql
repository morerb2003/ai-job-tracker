-- Phase 3: Add composite indexes for common filter combinations on job_applications

-- Index for filtering by user + status together (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_job_applications_user_status
    ON job_applications(user_id, status);

-- Index for sorting by most recent per user (list page default sort)
CREATE INDEX IF NOT EXISTS idx_job_applications_user_created
    ON job_applications(user_id, created_at DESC);

-- Index for case-insensitive company name search support
CREATE INDEX IF NOT EXISTS idx_job_applications_company_name_lower
    ON job_applications(user_id, LOWER(company_name));
