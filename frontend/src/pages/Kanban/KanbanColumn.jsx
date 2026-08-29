import React from "react";
import { Plus } from "lucide-react";
import KanbanCard from "./KanbanCard";

const KanbanColumn = ({
  column,
  applications = [],
  isDragOver,
  draggedCardId,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onEdit,
  onDelete,
  onStatusChange,
  onAddApplication,
}) => {
  const { id: statusKey, title, dotColor, badgeColor, borderColor, Icon } = column;
  const count = applications.length;

  return (
    <div
      onDragOver={(e) => onDragOver(e, statusKey)}
      onDragLeave={(e) => onDragLeave(e, statusKey)}
      onDrop={(e) => onDrop(e, statusKey)}
      className={`flex flex-col min-w-[300px] max-w-[340px] flex-1 rounded-2xl border transition-all duration-200 ${
        isDragOver
          ? "border-emerald-500/80 bg-emerald-950/15 ring-2 ring-emerald-500/30"
          : "border-zinc-800/80 bg-zinc-950/60"
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-3.5 bg-zinc-900/40 rounded-t-2xl">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
          {Icon && <Icon className="h-4 w-4 text-zinc-400" />}
          <h3 className="font-semibold text-sm text-zinc-200 truncate">
            {title}
          </h3>
          <span
            className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${badgeColor}`}
          >
            {count}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAddApplication(statusKey)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-emerald-400 transition"
          title={`Add application to ${title}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Cards Container */}
      <div className="flex-1 space-y-3 p-3 overflow-y-auto max-h-[calc(100vh-270px)] min-h-[220px]">
        {applications.length > 0 ? (
          applications.map((app) => (
            <KanbanCard
              key={app.id}
              application={app}
              isDragging={draggedCardId === app.id}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))
        ) : (
          <div
            className={`flex flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-all ${
              isDragOver
                ? "border-emerald-500/60 bg-emerald-500/5 text-emerald-300"
                : "border-zinc-800/70 bg-zinc-900/20 text-zinc-600"
            }`}
          >
            <p className="text-xs font-medium">
              {isDragOver ? "Release to drop application here" : "No applications"}
            </p>
            <button
              type="button"
              onClick={() => onAddApplication(statusKey)}
              className="mt-2 text-[11px] font-semibold text-emerald-400/80 hover:text-emerald-400 transition underline underline-offset-2"
            >
              + Add first job
            </button>
          </div>
        )}

        {/* Drop indicator placeholder when dragging over column with items */}
        {isDragOver && applications.length > 0 && (
          <div className="rounded-xl border-2 border-dashed border-emerald-500/50 bg-emerald-500/10 p-3 text-center text-xs font-medium text-emerald-300 animate-pulse">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
