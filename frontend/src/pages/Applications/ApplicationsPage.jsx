import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Search, Filter, Loader2, AlertCircle,
  BriefcaseBusiness, ChevronLeft, ChevronRight
} from "lucide-react";
import {
  getApplications,
  deleteApplication,
  updateStatus,
  getApplicationStats,
} from "../../api/jobApplicationApi";
import ApplicationCard from "./ApplicationCard";
import ApplicationForm from "./ApplicationForm";

const STATUS_OPTIONS = ["", "SAVED", "APPLIED", "INTERVIEWING", "OFFER", "REJECTED", "WITHDRAWN"];

const STATUS_COLORS = {
  SAVED:        "bg-slate-500/20 text-slate-300",
  APPLIED:      "bg-blue-500/20 text-blue-300",
  INTERVIEWING: "bg-amber-500/20 text-amber-300",
  OFFER:        "bg-emerald-500/20 text-emerald-300",
  REJECTED:     "bg-red-500/20 text-red-300",
  WITHDRAWN:    "bg-zinc-500/20 text-zinc-400",
};

const ApplicationsPage = () => {
  const queryClient = useQueryClient();

  // ── State ─────────────────────────────────────────────────────────────────
  const [search, setSearch]         = useState("");
  const [status, setStatus]         = useState("");
  const [page, setPage]             = useState(0);
  const [size]                      = useState(10);
  const [sortBy]                    = useState("createdAt");
  const [sortDir]                   = useState("desc");
  const [showForm, setShowForm]     = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, name }

  // ── Queries ───────────────────────────────────────────────────────────────
  const { data: stats } = useQuery({
    queryKey: ["applicationStats"],
    queryFn: getApplicationStats,
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["applications", { search, status, page, size, sortBy, sortDir }],
    queryFn: () => getApplications({ search: search || undefined, status: status || undefined, page, size, sortBy, sortDir }),
    placeholderData: (prev) => prev,
  });

  // ── Mutations ─────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["applicationStats"] });
      setDeleteConfirm(null);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status: s }) => updateStatus(id, s),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["applicationStats"] });
    },
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleStatusFilter = (e) => {
    setStatus(e.target.value);
    setPage(0);
  };

  const handleEdit = (app) => {
    setEditTarget(app);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditTarget(null);
  };

  const handleDelete = (id, name) => setDeleteConfirm({ id, name });

  const handleStatusChange = (id, newStatus) => {
    statusMutation.mutate({ id, status: newStatus });
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const applications = data?.content ?? [];
  const totalPages   = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ── Page Header ───────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              <BriefcaseBusiness className="h-6 w-6 text-emerald-400" />
              Applications
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Track and manage your job applications
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Add Application
          </button>
        </div>

        {/* ── Stats Pills ───────────────────────────────────────────────── */}
        {stats && (
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300">
              Total: <strong>{stats.total}</strong>
            </span>
            {Object.entries(STATUS_COLORS).map(([s, cls]) => (
              stats[s] > 0 && (
                <button
                  key={s}
                  onClick={() => { setStatus(status === s ? "" : s); setPage(0); }}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition hover:opacity-80 ${cls} ${status === s ? "ring-2 ring-white/20" : ""}`}
                >
                  {s}: {stats[s]}
                </button>
              )
            ))}
          </div>
        )}

        {/* ── Filter Bar ────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by company name..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 pl-9 pr-4 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <select
              value={status}
              onChange={handleStatusFilter}
              className="h-10 rounded-xl border border-zinc-800 bg-zinc-900 pl-9 pr-8 text-sm text-zinc-300 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition cursor-pointer appearance-none"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s || "All Statuses"}</option>
              ))}
            </select>
          </div>

          {/* Result count */}
          {!isLoading && (
            <span className="shrink-0 text-xs text-zinc-500">
              {totalElements} result{totalElements !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* ── Content ───────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <p className="text-zinc-400">
              {error?.response?.data?.message ?? "Failed to load applications."}
            </p>
            <button
              onClick={() => queryClient.invalidateQueries({ queryKey: ["applications"] })}
              className="text-sm text-emerald-400 underline hover:text-emerald-300"
            >
              Try again
            </button>
          </div>
        ) : applications.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-zinc-800 py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-600">
              <BriefcaseBusiness className="h-8 w-8" />
            </div>
            <div>
              <p className="text-base font-medium text-zinc-300">No applications yet</p>
              <p className="mt-1 text-sm text-zinc-600">
                {search || status ? "Try adjusting your filters." : "Click \"Add Application\" to get started."}
              </p>
            </div>
            {!search && !status && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
              >
                <Plus className="h-4 w-4" /> Add Application
              </button>
            )}
          </div>
        ) : (
          /* Application grid */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ────────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-zinc-800 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>

            <span className="text-sm text-zinc-500">
              Page {page + 1} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-zinc-800 disabled:opacity-40"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* ── Application Form Modal ─────────────────────────────────────── */}
      {showForm && (
        <ApplicationForm
          application={editTarget}
          onClose={handleCloseForm}
        />
      )}

      {/* ── Delete Confirmation Modal ──────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-zinc-100">Delete Application?</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Remove <span className="font-medium text-zinc-200">{deleteConfirm.name}</span> from your tracker?
              This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirm.id)}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
              >
                {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
