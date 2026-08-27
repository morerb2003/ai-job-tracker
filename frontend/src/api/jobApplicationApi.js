import axiosClient from "./axiosClient";

const BASE = "/api/v1/applications";

/**
 * Create a new job application.
 * @param {Object} data - JobApplicationRequest fields
 */
export const createApplication = (data) =>
  axiosClient.post(BASE, data).then((r) => r.data);

/**
 * Get paginated & filtered list of applications.
 * @param {Object} params - { search, status, page, size, sortBy, sortDir }
 */
export const getApplications = (params = {}) =>
  axiosClient.get(BASE, { params }).then((r) => r.data);

/**
 * Get a single application by id.
 * @param {string} id - UUID
 */
export const getApplicationById = (id) =>
  axiosClient.get(`${BASE}/${id}`).then((r) => r.data);

/**
 * Full update (PUT) of an application.
 * @param {string} id - UUID
 * @param {Object} data - JobApplicationRequest fields
 */
export const updateApplication = (id, data) =>
  axiosClient.put(`${BASE}/${id}`, data).then((r) => r.data);

/**
 * Partial update — change status only.
 * @param {string} id - UUID
 * @param {string} status - JobApplicationStatus value
 */
export const updateStatus = (id, status) =>
  axiosClient.patch(`${BASE}/${id}/status`, null, { params: { status } }).then((r) => r.data);

/**
 * Delete an application.
 * @param {string} id - UUID
 */
export const deleteApplication = (id) =>
  axiosClient.delete(`${BASE}/${id}`).then((r) => r.data);

/**
 * Get status counts map for dashboard.
 * Returns { total, SAVED, APPLIED, INTERVIEWING, OFFER, REJECTED, WITHDRAWN }
 */
export const getApplicationStats = () =>
  axiosClient.get(`${BASE}/stats`).then((r) => r.data);
