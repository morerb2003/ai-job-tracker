import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Loader2 } from "lucide-react";
import { createApplication, updateApplication } from "../../api/jobApplicationApi";

const STATUSES = ["SAVED", "APPLIED", "INTERVIEWING", "OFFER", "REJECTED", "WITHDRAWN"];
const EMP_TYPES = ["Full-time", "Part-time", "Contract", "Remote", "Internship", "Freelance"];

const emptyForm = {
  companyName: "",
  jobTitle: "",
  jobUrl: "",
  location: "",
  employmentType: "",
  status: "SAVED",
  salaryMin: "",
  salaryMax: "",
  notes: "",
  appliedAt: "",
};

const toIso = (dateStr) => (dateStr ? new Date(dateStr).toISOString() : null);
const toDateInput = (iso) => (iso ? iso.split("T")[0] : "");

const ApplicationForm = ({ application, onClose }) => {
  const queryClient = useQueryClient();
  const isEdit = Boolean(application);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Pre-fill form in edit mode
  useEffect(() => {
    if (isEdit) {
      setForm({
        companyName:    application.companyName    ?? "",
        jobTitle:       application.jobTitle       ?? "",
        jobUrl:         application.jobUrl         ?? "",
        location:       application.location       ?? "",
        employmentType: application.employmentType ?? "",
        status:         application.status         ?? "SAVED",
        salaryMin:      application.salaryMin      ?? "",
        salaryMax:      application.salaryMax      ?? "",
        notes:          application.notes          ?? "",
        appliedAt:      toDateInput(application.appliedAt),
      });
    }
  }, [application, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.companyName.trim()) errs.companyName = "Company name is required";
    if (!form.jobTitle.trim()) errs.jobTitle = "Job title is required";
    if (form.salaryMin && form.salaryMax && Number(form.salaryMin) > Number(form.salaryMax)) {
      errs.salaryMax = "Max salary must be ≥ min salary";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const buildPayload = () => ({
    companyName:    form.companyName.trim(),
    jobTitle:       form.jobTitle.trim(),
    jobUrl:         form.jobUrl.trim() || null,
    location:       form.location.trim() || null,
    employmentType: form.employmentType || null,
    status:         form.status,
    salaryMin:      form.salaryMin !== "" ? Number(form.salaryMin) : null,
    salaryMax:      form.salaryMax !== "" ? Number(form.salaryMax) : null,
    notes:          form.notes.trim() || null,
    appliedAt:      toIso(form.appliedAt),
  });

  const mutation = useMutation({
    mutationFn: (payload) =>
      isEdit ? updateApplication(application.id, payload) : createApplication(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["applicationStats"] });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate(buildPayload());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 py-4">
          <h2 className="text-lg font-semibold text-zinc-100">
            {isEdit ? "Edit Application" : "Add New Application"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Server error */}
        {mutation.isError && (
          <div className="mx-6 mt-4 rounded-lg border border-red-800/40 bg-red-950/30 p-3 text-sm text-red-400">
            {mutation.error?.response?.data?.message ?? "Something went wrong. Please try again."}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 p-6">

          {/* Company Name */}
          <div className="col-span-2 sm:col-span-1">
            <label className="form-label">Company Name *</label>
            <input name="companyName" value={form.companyName} onChange={handleChange}
              className={`form-input ${errors.companyName ? "border-red-600" : ""}`}
              placeholder="e.g. Google" />
            {errors.companyName && <p className="form-error">{errors.companyName}</p>}
          </div>

          {/* Job Title */}
          <div className="col-span-2 sm:col-span-1">
            <label className="form-label">Job Title *</label>
            <input name="jobTitle" value={form.jobTitle} onChange={handleChange}
              className={`form-input ${errors.jobTitle ? "border-red-600" : ""}`}
              placeholder="e.g. Software Engineer" />
            {errors.jobTitle && <p className="form-error">{errors.jobTitle}</p>}
          </div>

          {/* Job URL */}
          <div className="col-span-2">
            <label className="form-label">Job URL</label>
            <input name="jobUrl" value={form.jobUrl} onChange={handleChange}
              className="form-input" type="url"
              placeholder="https://careers.company.com/..." />
          </div>

          {/* Location */}
          <div className="col-span-2 sm:col-span-1">
            <label className="form-label">Location</label>
            <input name="location" value={form.location} onChange={handleChange}
              className="form-input" placeholder="e.g. Remote, New York" />
          </div>

          {/* Employment Type */}
          <div className="col-span-2 sm:col-span-1">
            <label className="form-label">Employment Type</label>
            <select name="employmentType" value={form.employmentType} onChange={handleChange}
              className="form-input">
              <option value="">Select type</option>
              {EMP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Status */}
          <div className="col-span-2 sm:col-span-1">
            <label className="form-label">Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              className="form-input">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Applied At */}
          <div className="col-span-2 sm:col-span-1">
            <label className="form-label">Applied Date</label>
            <input name="appliedAt" value={form.appliedAt} onChange={handleChange}
              type="date" className="form-input" />
          </div>

          {/* Salary Min */}
          <div className="col-span-2 sm:col-span-1">
            <label className="form-label">Salary Min ($)</label>
            <input name="salaryMin" value={form.salaryMin} onChange={handleChange}
              type="number" min="0" className="form-input" placeholder="e.g. 80000" />
          </div>

          {/* Salary Max */}
          <div className="col-span-2 sm:col-span-1">
            <label className="form-label">Salary Max ($)</label>
            <input name="salaryMax" value={form.salaryMax} onChange={handleChange}
              type="number" min="0" className={`form-input ${errors.salaryMax ? "border-red-600" : ""}`}
              placeholder="e.g. 120000" />
            {errors.salaryMax && <p className="form-error">{errors.salaryMax}</p>}
          </div>

          {/* Notes */}
          <div className="col-span-2">
            <label className="form-label">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange}
              rows={3} className="form-input resize-none"
              placeholder="Interview notes, recruiter contact, next steps..." />
          </div>

          {/* Actions */}
          <div className="col-span-2 flex justify-end gap-3 border-t border-zinc-800 pt-4">
            <button type="button" onClick={onClose}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-5 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-700">
              Cancel
            </button>
            <button type="submit" disabled={mutation.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-60">
              {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Application"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
