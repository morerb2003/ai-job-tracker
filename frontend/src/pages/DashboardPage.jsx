import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Kanban,
  LogOut,
  Plus,
  Shield,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getCurrentUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { user: authUser, logout } = useAuth();

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getCurrentUser,
    staleTime: 60000,
  });

  const currentUser = userProfile || authUser;

  const stats = [
    {
      label: "Total Applications",
      value: "14",
      change: "+3 this week",
      icon: <Briefcase className="h-5 w-5 text-emerald-400" />,
      color: "border-emerald-500/20 bg-emerald-500/5",
    },
    {
      label: "Active Interviews",
      value: "3",
      change: "Next: Tomorrow 2:30 PM",
      icon: <Calendar className="h-5 w-5 text-blue-400" />,
      color: "border-blue-500/20 bg-blue-500/5",
    },
    {
      label: "Offers Received",
      value: "1",
      change: "$215,000 / yr",
      icon: <CheckCircle2 className="h-5 w-5 text-amber-400" />,
      color: "border-amber-500/20 bg-amber-500/5",
    },
    {
      label: "AI Match Avg",
      value: "91%",
      change: "Top: 96% Match",
      icon: <Sparkles className="h-5 w-5 text-purple-400" />,
      color: "border-purple-500/20 bg-purple-500/5",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-zinc-950 shadow-md shadow-emerald-500/20">
                <Briefcase className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="font-bold text-lg tracking-tight text-zinc-50">
                JobTracker<span className="text-emerald-400">AI</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <span className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-emerald-400 border border-zinc-800">
                Overview
              </span>
              <span className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 cursor-not-allowed">
                Kanban (Phase 3)
              </span>
              <span className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 cursor-not-allowed">
                AI Matcher (Phase 5)
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-1.5 text-xs">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px]">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-semibold text-zinc-200 leading-tight">
                  {currentUser?.name || "Authenticated User"}
                </span>
                <span className="text-[10px] text-zinc-500 leading-tight">{currentUser?.email}</span>
              </div>
              <span className="ml-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                {currentUser?.role || "USER"}
              </span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              <Shield className="h-3.5 w-3.5" />
              <span>Protected Session Active (JWT Verified)</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-zinc-100">
              Welcome back, {currentUser?.name?.split(" ")[0] || "User"} 👋
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Here is what is happening across your job search pipeline today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
            >
              View Landing Page
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-5 transition hover:border-zinc-700 ${stat.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">{stat.label}</span>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-2">{stat.icon}</div>
              </div>
              <div className="mt-3 text-3xl font-extrabold text-zinc-100">{stat.value}</div>
              <div className="mt-1 text-xs text-zinc-400">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Profile & Auth Diagnostics Card */}
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-400" />
              <h2 className="font-semibold text-base text-zinc-100">
                Live User Profile & Security Details
              </h2>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              GET /api/v1/users/me: 200 OK
            </span>
          </div>

          <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/80 p-4">
              <div className="text-xs font-semibold uppercase text-zinc-500">Account ID</div>
              <div className="mt-1.5 font-mono text-xs text-zinc-300 break-all">
                {isLoading ? "Loading..." : currentUser?.id || "N/A"}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/80 p-4">
              <div className="text-xs font-semibold uppercase text-zinc-500">Verified Email</div>
              <div className="mt-1.5 font-medium text-sm text-zinc-200">
                {isLoading ? "Loading..." : currentUser?.email || "N/A"}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/80 p-4">
              <div className="text-xs font-semibold uppercase text-zinc-500">Assigned Role</div>
              <div className="mt-1.5 flex items-center gap-1.5 font-bold text-sm text-emerald-400">
                <Shield className="h-4 w-4" />
                <span>{isLoading ? "Loading..." : currentUser?.role || "USER"}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
