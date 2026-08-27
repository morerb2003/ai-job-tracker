import { ExternalLink, MapPin, Briefcase, Calendar, DollarSign, Pencil, Trash2 } from "lucide-react";

const STATUS_STYLES = {
  SAVED:        { bg: "bg-slate-500/20",   text: "text-slate-300",   dot: "bg-slate-400"   },
  APPLIED:      { bg: "bg-blue-500/20",    text: "text-blue-300",    dot: "bg-blue-400"    },
  INTERVIEWING: { bg: "bg-amber-500/20",   text: "text-amber-300",   dot: "bg-amber-400"   },
  OFFER:        { bg: "bg-emerald-500/20", text: "text-emerald-300", dot: "bg-emerald-400" },
  REJECTED:     { bg: "bg-red-500/20",     text: "text-red-300",     dot: "bg-red-400"     },
  WITHDRAWN:    { bg: "bg-zinc-500/20",    text: "text-zinc-400",    dot: "bg-zinc-500"    },
};

const formatDate = (iso) => {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const formatSalary = (min, max) => {
  if (!min && !max) return null;
  const fmt = (n) => `$${Number(n).toLocaleString()}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max)}`;
};

const ApplicationCard = ({ application, onEdit, onDelete, onStatusChange }) => {
  const { id, companyName, jobTitle, jobUrl, location, employmentType,
          status, salaryMin, salaryMax, notes, appliedAt, createdAt } = application;

  const style = STATUS_STYLES[status] ?? STATUS_STYLES.SAVED;
  const salary = formatSalary(salaryMin, salaryMax);
  const dateLabel = appliedAt ? `Applied ${formatDate(appliedAt)}` : `Saved ${formatDate(createdAt)}`;

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-lg">

      {/* Top row: company + status badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="truncate text-base font-semibold text-zinc-100 leading-tight">
            {jobTitle}
          </h3>
          <p className="mt-0.5 truncate text-sm font-medium text-zinc-400">{companyName}</p>
        </div>

        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
          {status}
        </span>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-500">
        {location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />{location}
          </span>
        )}
        {employmentType && (
          <span className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />{employmentType}
          </span>
        )}
        {salary && (
          <span className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />{salary}
          </span>
        )}
        <span className="flex items-center gap-1 ml-auto">
          <Calendar className="h-3 w-3" />{dateLabel}
        </span>
      </div>

      {/* Notes preview */}
      {notes && (
        <p className="line-clamp-2 text-xs text-zinc-500 leading-relaxed">{notes}</p>
      )}

      {/* Divider + action row */}
      <div className="flex items-center justify-between gap-2 border-t border-zinc-800/60 pt-3 mt-1">
        {/* Job URL */}
        {jobUrl ? (
          <a
            href={jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ExternalLink className="h-3 w-3" /> View Job
          </a>
        ) : (
          <span />
        )}

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Status quick-change */}
          <select
            value={status}
            onChange={(e) => onStatusChange(id, e.target.value)}
            className="h-7 rounded-lg border border-zinc-700 bg-zinc-800 px-2 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            {["SAVED","APPLIED","INTERVIEWING","OFFER","REJECTED","WITHDRAWN"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={() => onEdit(application)}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>

          <button
            onClick={() => onDelete(id, companyName)}
            className="inline-flex items-center gap-1 rounded-lg border border-red-900/40 bg-red-950/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-900/40 hover:text-red-300"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
