import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Bookmark,
  Plus,
  ArrowRight,
  Kanban,
  Sparkles,
  Shield,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getApplicationStats, getApplications } from "../../api/jobApplicationApi";

const DashboardPage = () => {
  const { user } = useAuth();

  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["applicationStats"],
    queryFn: getApplicationStats,
  });

  const { data: recentAppsData, isLoading: isAppsLoading } = useQuery({
    queryKey: ["applications", { size: 5, sortBy: "createdAt", sortDir: "desc" }],
    queryFn: () => getApplications({ size: 5, sortBy: "createdAt", sortDir: "desc" }),
  });

  const recentApplications = recentAppsData?.content || [];

  const statCards = [
    {
      title: "Total Applications",
      value: stats?.total ?? 0,
      description: "Applications tracked across all stages",
      icon: Briefcase,
      color: "border-blue-500/20 bg-blue-500/5 text-blue-400",
      pill: "bg-blue-500/10 text-blue-300",
    },
    {
      title: "Active Interviews",
      value: stats?.INTERVIEWING ?? 0,
      description: "Scheduled and active rounds",
      icon: Calendar,
      color: "border-amber-500/20 bg-amber-500/5 text-amber-400",
      pill: "bg-amber-500/10 text-amber-300",
    },
    {
      title: "Offers Received",
      value: stats?.OFFER ?? 0,
      description: "Final job offers secured",
      icon: CheckCircle2,
      color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
      pill: "bg-emerald-500/10 text-emerald-300",
    },
    {
      title: "Saved Wishlist",
      value: stats?.SAVED ?? 0,
      description: "Opportunities bookmarked for later",
      icon: Bookmark,
      color: "border-purple-500/20 bg-purple-500/5 text-purple-400",
      pill: "bg-purple-500/10 text-purple-300",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Welcome Banner ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <Shield className="h-3.5 w-3.5" />
            <span>Active Session - {user?.role || "USER"}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
            Welcome back, {user?.name ? user.name.split(" ")[0] : "User"} 👋
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Here is what is happening across your job search pipeline today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/kanban"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
          >
            <Kanban className="h-4 w-4 text-emerald-400" />
            <span>Kanban Board</span>
          </Link>
          <Link
            to="/applications"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Application</span>
          </Link>
        </div>
      </div>

      {/* ── Stats Grid ────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`rounded-2xl border p-5 transition hover:border-zinc-700 ${stat.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">{stat.title}</span>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-2">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 text-3xl font-extrabold text-zinc-100">
                {isStatsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                ) : (
                  stat.value
                )}
              </div>
              <div className="mt-1 text-xs text-zinc-500">{stat.description}</div>
            </div>
          );
        })}
      </div>

      {/* ── Recent Activity & Quick Navigation ────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Recent Applications */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-emerald-400" />
              <h2 className="font-semibold text-base text-zinc-100">
                Recent Applications
              </h2>
            </div>
            <Link
              to="/applications"
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition"
            >
              <span>View all</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-zinc-800/60">
            {isAppsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
              </div>
            ) : recentApplications.length === 0 ? (
              <div className="py-12 text-center text-sm text-zinc-500">
                <p>No applications logged yet.</p>
                <Link
                  to="/applications"
                  className="mt-2 inline-block text-xs font-semibold text-emerald-400 underline"
                >
                  Create your first application
                </Link>
              </div>
            ) : (
              recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between py-3 hover:bg-zinc-900/40 px-2 rounded-xl transition"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-zinc-200 truncate">
                      {app.jobTitle}
                    </h3>
                    <p className="text-xs text-zinc-500 truncate">
                      {app.companyName} {app.location ? `• ${app.location}` : ""}
                    </p>
                  </div>

                  <span
                    className={`ml-4 shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                      app.status === "OFFER"
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        : app.status === "INTERVIEWING"
                        ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                        : app.status === "APPLIED"
                        ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                        : app.status === "REJECTED"
                        ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                        : "bg-zinc-500/15 text-zinc-400 border-zinc-500/30"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Platform Shortcuts & AI Teaser */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <h3 className="font-semibold text-base text-zinc-100">
                AI Career Assistant
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Upload your resume to compare against active job listings, detect skill gaps, and get AI-tailored recommendations.
            </p>
            <Link
              to="/ai-analysis"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>Explore Resume AI</span>
            </Link>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm">
            <h3 className="font-semibold text-sm text-zinc-200 mb-3">
              Quick Shortcuts
            </h3>
            <div className="space-y-2 text-xs">
              <Link
                to="/kanban"
                className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-800/80 bg-zinc-950/60 hover:bg-zinc-800/60 text-zinc-300 transition"
              >
                <div className="flex items-center gap-2">
                  <Kanban className="h-4 w-4 text-emerald-400" />
                  <span>Pipeline Kanban</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-500" />
              </Link>
              <Link
                to="/applications"
                className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-800/80 bg-zinc-950/60 hover:bg-zinc-800/60 text-zinc-300 transition"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-400" />
                  <span>All Applications</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-500" />
              </Link>
              <Link
                to="/interviews"
                className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-800/80 bg-zinc-950/60 hover:bg-zinc-800/60 text-zinc-300 transition"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-400" />
                  <span>Interview Schedule</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
