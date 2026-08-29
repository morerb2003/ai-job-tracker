import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Kanban,
  Plus,
  Search,
  RefreshCw,
  Bookmark,
  Send,
  Calendar,
  Award,
  XCircle,
  Archive,
  Loader2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getApplications,
  updateStatus,
  deleteApplication,
} from "../../api/jobApplicationApi";
import KanbanColumn from "./KanbanColumn";
import ApplicationForm from "../Applications/ApplicationForm";

const COLUMNS = [
  {
    id: "SAVED",
    title: "Saved / Wishlist",
    dotColor: "bg-slate-400",
    badgeColor: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
    borderColor: "border-slate-500/30",
    Icon: Bookmark,
  },
  {
    id: "APPLIED",
    title: "Applied",
    dotColor: "bg-blue-400",
    badgeColor: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    borderColor: "border-blue-500/30",
    Icon: Send,
  },
  {
    id: "INTERVIEWING",
    title: "Interviewing",
    dotColor: "bg-amber-400",
    badgeColor: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    borderColor: "border-amber-500/30",
    Icon: Calendar,
  },
  {
    id: "OFFER",
    title: "Offer Received",
    dotColor: "bg-emerald-400",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    borderColor: "border-emerald-500/30",
    Icon: Award,
  },
  {
    id: "REJECTED",
    title: "Rejected",
    dotColor: "bg-rose-400",
    badgeColor: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
    borderColor: "border-rose-500/30",
    Icon: XCircle,
  },
  {
    id: "WITHDRAWN",
    title: "Withdrawn",
    dotColor: "bg-zinc-400",
    badgeColor: "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30",
    borderColor: "border-zinc-500/30",
    Icon: Archive,
  },
];

const KanbanPage = () => {
  const queryClient = useQueryClient();

  // ── Search & Filter State ──────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedCard, setDraggedCard] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // ── Modal State ────────────────────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [presetStatus, setPresetStatus] = useState("SAVED");
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, name }

  // ── Queries ────────────────────────────────────────────────────────────────
  const {
    data: applicationsData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["applications", { size: 200 }],
    queryFn: () => getApplications({ size: 200, sortBy: "createdAt", sortDir: "desc" }),
  });

  const applications = useMemo(
    () => applicationsData?.content || [],
    [applicationsData]
  );

  // ── Mutations ──────────────────────────────────────────────────────────────
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateStatus(id, status),
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["applications"] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(["applications", { size: 200 }]);

      // Optimistically update query cache
      if (previousData?.content) {
        queryClient.setQueryData(["applications", { size: 200 }], {
          ...previousData,
          content: previousData.content.map((app) =>
            app.id === id ? { ...app, status } : app
          ),
        });
      }

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["applications", { size: 200 }],
          context.previousData
        );
      }
      toast.error(err?.response?.data?.message || "Failed to update application status");
    },
    onSuccess: (updatedApp, { status }) => {
      toast.success(`Moved to ${status}`, {
        icon: "📋",
        style: {
          borderRadius: "10px",
          background: "#18181b",
          color: "#fafafa",
          border: "1px solid #27272a",
        },
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["applicationStats"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["applicationStats"] });
      setDeleteConfirm(null);
      toast.success("Application deleted successfully");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete application");
    },
  });

  // ── Drag and Drop Handlers ─────────────────────────────────────────────────
  const handleDragStart = (e, application) => {
    setDraggedCard(application);
    e.dataTransfer.setData("text/plain", application.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e, columnStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== columnStatus) {
      setDragOverColumn(columnStatus);
    }
  };

  const handleDragLeave = (e, columnStatus) => {
    // Only reset if actually leaving the column container
    if (e.currentTarget.contains(e.relatedTarget)) return;
    if (dragOverColumn === columnStatus) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    const appId = e.dataTransfer.getData("text/plain") || draggedCard?.id;
    if (!appId) return;

    const targetApp = applications.find((a) => a.id === appId);
    if (!targetApp) return;

    if (targetApp.status === targetStatus) {
      setDraggedCard(null);
      return;
    }

    statusMutation.mutate({ id: appId, status: targetStatus });
    setDraggedCard(null);
  };

  // ── Card Action Handlers ───────────────────────────────────────────────────
  const handleStatusChange = (id, newStatus) => {
    statusMutation.mutate({ id, status: newStatus });
  };

  const handleEdit = (app) => {
    setEditTarget(app);
    setIsFormOpen(true);
  };

  const handleDelete = (id, name) => {
    setDeleteConfirm({ id, name });
  };

  const handleAddInColumn = (statusKey) => {
    setEditTarget(null);
    setPresetStatus(statusKey);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditTarget(null);
    setPresetStatus("SAVED");
  };

  // ── Filtered Applications by Column ────────────────────────────────────────
  const filteredApps = useMemo(() => {
    if (!searchTerm.trim()) return applications;
    const term = searchTerm.toLowerCase();
    return applications.filter(
      (app) =>
        app.companyName?.toLowerCase().includes(term) ||
        app.jobTitle?.toLowerCase().includes(term) ||
        app.location?.toLowerCase().includes(term)
    );
  }, [applications, searchTerm]);

  const appsByColumn = useMemo(() => {
    const map = {};
    COLUMNS.forEach((col) => {
      map[col.id] = [];
    });
    filteredApps.forEach((app) => {
      if (map[app.status]) {
        map[app.status].push(app);
      } else {
        // Fallback for unexpected status
        map.SAVED.push(app);
      }
    });
    return map;
  }, [filteredApps]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950 px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-[1700px] space-y-6">

        {/* ── Top Header & Stats ────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-zinc-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              <Kanban className="h-4 w-4" />
              <span>Interactive Pipeline</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl flex items-center gap-3">
              Kanban Board
              {isFetching && (
                <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
              )}
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Drag and drop job applications across stages to update your interview pipeline in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Refresh button */}
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
              title="Refresh applications"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            {/* Add Application Button */}
            <button
              type="button"
              onClick={() => {
                setEditTarget(null);
                setPresetStatus("SAVED");
                setIsFormOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 active:scale-95 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Application</span>
            </button>
          </div>
        </div>

        {/* ── Search Bar & Pipeline Highlights ─────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search filter */}
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by company, role, or location..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-2 pl-10 pr-4 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-zinc-400">
              Total: <strong className="text-zinc-200">{applications.length}</strong>
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-blue-300">
              Applied: <strong>{appsByColumn.APPLIED?.length || 0}</strong>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-amber-300">
              Interviewing: <strong>{appsByColumn.INTERVIEWING?.length || 0}</strong>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-emerald-300">
              Offers: <strong>{appsByColumn.OFFER?.length || 0}</strong>
            </div>
          </div>
        </div>

        {/* ── Main Kanban Columns Board ─────────────────────────────────── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
            <p className="text-sm text-zinc-400 font-medium">Loading your job pipeline...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <p className="text-zinc-300 font-medium">
              {error?.response?.data?.message || "Failed to load Kanban board applications."}
            </p>
            <button
              onClick={() => refetch()}
              className="text-xs text-emerald-400 underline hover:text-emerald-300"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-6 pt-1 select-none custom-scrollbar">
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                applications={appsByColumn[column.id] || []}
                isDragOver={dragOverColumn === column.id}
                draggedCardId={draggedCard?.id}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onAddApplication={handleAddInColumn}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Application Form Modal ─────────────────────────────────────── */}
      {isFormOpen && (
        <ApplicationForm
          application={editTarget}
          initialStatus={presetStatus}
          onClose={handleCloseForm}
        />
      )}

      {/* ── Delete Confirmation Modal ──────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-zinc-100">Delete Application?</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Are you sure you want to remove{" "}
              <span className="font-medium text-zinc-200">{deleteConfirm.name}</span> from your board?
              This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(deleteConfirm.id)}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500 disabled:opacity-60 transition"
              >
                {deleteMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanPage;
