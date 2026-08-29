import React from "react";
import {
  ExternalLink,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Pencil,
  Trash2,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";

const STATUS_OPTIONS = [
  "SAVED",
  "APPLIED",
  "INTERVIEWING",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

const STATUS_THEMES = {
  SAVED: {
    border: "hover:border-slate-500/50",
    accent: "bg-slate-400",
    pill: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  },
  APPLIED: {
    border: "hover:border-blue-500/50",
    accent: "bg-blue-400",
    pill: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  },
  INTERVIEWING: {
    border: "hover:border-amber-500/50",
    accent: "bg-amber-400",
    pill: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  OFFER: {
    border: "hover:border-emerald-500/50",
    accent: "bg-emerald-400",
    pill: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
  REJECTED: {
    border: "hover:border-rose-500/50",
    accent: "bg-rose-400",
    pill: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  },
  WITHDRAWN: {
    border: "hover:border-zinc-500/50",
    accent: "bg-zinc-400",
    pill: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  },
};

const formatDate = (iso) => {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatSalary = (min, max) => {
  if (!min && !max) return null;
  const fmt = (n) => `$${Number(n).toLocaleString()}`;
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `≥ ${fmt(min)}`;
  return `≤ ${fmt(max)}`;
};

const KanbanCard = ({
  application,
  onDragStart,
  onDragEnd,
  isDragging,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const {
    id,
    companyName,
    jobTitle,
    jobUrl,
    location,
    employmentType,
    status,
    salaryMin,
    salaryMax,
    notes,
    appliedAt,
    createdAt,
  } = application;

  const currentIdx = STATUS_OPTIONS.indexOf(status);
  const prevStatus = currentIdx > 0 ? STATUS_OPTIONS[currentIdx - 1] : null;
  const nextStatus =
    currentIdx >= 0 && currentIdx < STATUS_OPTIONS.length - 1
      ? STATUS_OPTIONS[currentIdx + 1]
      : null;

  const theme = STATUS_THEMES[status] || STATUS_THEMES.SAVED;
  const salary = formatSalary(salaryMin, salaryMax);
  const displayDate = appliedAt ? formatDate(appliedAt) : formatDate(createdAt);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, application)}
      onDragEnd={onDragEnd}
      className={`group relative flex flex-col gap-2.5 rounded-xl border border-zinc-800/90 bg-zinc-900/85 p-4 shadow-sm backdrop-blur-md transition-all duration-200 cursor-grab active:cursor-grabbing hover:bg-zinc-900 hover:shadow-md ${
        theme.border
      } ${
        isDragging
          ? "opacity-40 scale-[0.98] rotate-1 border-dashed border-emerald-500 ring-2 ring-emerald-500/20"
          : "opacity-100"
      }`}
    >
      {/* Top row: Title + Drag handle + Company */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-zinc-100 leading-snug truncate group-hover:text-emerald-400 transition-colors">
            {jobTitle}
          </h4>
          <p className="mt-0.5 text-xs font-medium text-zinc-400 truncate">
            {companyName}
          </p>
        </div>

        <div className="flex items-center gap-1 text-zinc-600 group-hover:text-zinc-400 transition-colors">
          <GripVertical className="h-4 w-4" />
        </div>
      </div>

      {/* Meta tags */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-400">
        {location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3 text-zinc-500" />
            <span className="truncate max-w-[110px]">{location}</span>
          </span>
        )}

        {employmentType && (
          <span className="inline-flex items-center gap-1">
            <Briefcase className="h-3 w-3 text-zinc-500" />
            <span>{employmentType}</span>
          </span>
        )}

        {salary && (
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <DollarSign className="h-3 w-3" />
            <span>{salary}</span>
          </span>
        )}

        {displayDate && (
          <span className="inline-flex items-center gap-1 text-zinc-500 ml-auto">
            <Calendar className="h-3 w-3" />
            <span>{displayDate}</span>
          </span>
        )}
      </div>

      {/* Notes preview */}
      {notes && (
        <div className="flex items-start gap-1.5 rounded-lg bg-zinc-950/60 p-2 text-[11px] text-zinc-400 border border-zinc-800/60">
          <FileText className="h-3 w-3 mt-0.5 shrink-0 text-zinc-500" />
          <p className="line-clamp-2 leading-relaxed">{notes}</p>
        </div>
      )}

      {/* Footer: Job link + Quick Shift + Actions */}
      <div className="flex items-center justify-between gap-1.5 border-t border-zinc-800/80 pt-2.5 mt-1 text-xs">
        {/* Left: Job link */}
        <div>
          {jobUrl ? (
            <a
              href={jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              title="Open job posting"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Link</span>
            </a>
          ) : (
            <span className="text-[10px] text-zinc-600">No link</span>
          )}
        </div>

        {/* Right: Quick actions and transitions */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {/* Quick status navigation buttons */}
          {prevStatus && (
            <button
              type="button"
              onClick={() => onStatusChange(id, prevStatus)}
              className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition"
              title={`Move back to ${prevStatus}`}
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
          )}

          {nextStatus && (
            <button
              type="button"
              onClick={() => onStatusChange(id, nextStatus)}
              className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition"
              title={`Advance to ${nextStatus}`}
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          )}

          {/* Edit */}
          <button
            type="button"
            onClick={() => onEdit(application)}
            className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100 transition"
            title="Edit Application"
          >
            <Pencil className="h-3 w-3" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => onDelete(id, `${jobTitle} @ ${companyName}`)}
            className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-red-900/30 bg-zinc-950 text-red-400 hover:border-red-800/60 hover:bg-red-950/40 hover:text-red-300 transition"
            title="Delete Application"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
