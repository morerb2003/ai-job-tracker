import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Bot,
  BrainCircuit,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Database,
  FileSearch,
  Kanban,
  Lock,
  MessageSquareCode,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getApiHealth } from "../api/healthApi";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { data: healthData, error: healthError, isLoading: healthLoading } = useQuery({
    queryKey: ["api-health"],
    queryFn: getApiHealth,
    retry: 1,
    refetchInterval: 30000,
  });

  const isOnline = healthData?.status === "UP";

  const features = [
    {
      icon: <Kanban className="h-6 w-6 text-emerald-400" />,
      title: "Interactive Kanban Board",
      description:
        "Visually manage your job search across custom stages: Saved, Applied, Interviewing, Offer, and Rejected with instant drag-and-drop clarity.",
      badge: "Real-time Flow",
    },
    {
      icon: <BrainCircuit className="h-6 w-6 text-blue-400" />,
      title: "AI Resume & JD Matching",
      description:
        "Leverage AI to parse job descriptions, compute match scores, pinpoint skill gaps, and get personalized resume optimization tips.",
      badge: "Gemini AI",
    },
    {
      icon: <MessageSquareCode className="h-6 w-6 text-purple-400" />,
      title: "Interview Copilot & Notes",
      description:
        "Schedule interview rounds, log recruiter notes, practice role-specific technical questions, and track behavioral performance.",
      badge: "Interview Prep",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-amber-400" />,
      title: "Analytics & Success Funnel",
      description:
        "Understand your application-to-interview conversion rates, track response times, and identify top-performing channels.",
      badge: "Actionable Insights",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-400" />,
      title: "Enterprise JWT & RBAC Security",
      description:
        "Built on Spring Security 6 with dual-token authentication (JWT access + rotating refresh tokens) and PostgreSQL persistence.",
      badge: "Zero Trust",
    },
    {
      icon: <Zap className="h-6 w-6 text-amber-300" />,
      title: "Fast, Responsive & Offline Ready",
      description:
        "Engineered with React 19, Vite, React Query caching, and Tailwind CSS for instant sub-100ms interactions.",
      badge: "Ultra Fast",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Add or Paste Job Opportunities",
      desc: "Save job openings with company name, title, salary range, and job description links in seconds.",
    },
    {
      step: "02",
      title: "Run AI Match & Tailor Application",
      desc: "Our AI scans your resume against the JD, provides a match percentage, and recommends critical keywords.",
    },
    {
      step: "03",
      title: "Track Interviews & Land Offers",
      desc: "Move cards across your pipeline, prepare for upcoming interview rounds, and celebrate winning offers.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-zinc-950 shadow-lg shadow-emerald-500/20 transition group-hover:scale-105">
              <Briefcase className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-lg tracking-tight text-zinc-50">
                JobTracker<span className="text-emerald-400">AI</span>
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                  v2.0
                </span>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="transition hover:text-zinc-100">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-zinc-100">
              How It Works
            </a>
            <a href="#tech-stack" className="transition hover:text-zinc-100">
              Architecture
            </a>
            <a href="#status" className="transition hover:text-zinc-100 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isOnline ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isOnline ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                ></span>
              </span>
              System Status
            </a>
          </nav>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 text-xs text-zinc-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span className="font-semibold text-zinc-200">{user?.name || user?.email}</span>
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400 font-bold border border-emerald-500/20">
                  {user?.role || "USER"}
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-zinc-800 bg-zinc-900/80 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-zinc-100"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-950 shadow-md shadow-emerald-400/20 transition hover:bg-emerald-300 active:scale-95"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
        {/* Background glow gradient */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-600/20 via-teal-500/15 to-blue-600/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            {/* Pill Banner */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-300 mb-6 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Intelligent Career Management & AI Copilot</span>
              <ChevronRight className="h-3.5 w-3.5 opacity-70" />
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl sm:leading-[1.15]">
              Track Applications. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Ace Interviews.
              </span>{" "}
              Powered by AI.
            </h1>

            <p className="mt-6 text-lg text-zinc-400 sm:text-xl">
              Organize your job search in high-performance visual pipelines, match your resume against
              job descriptions with AI, and prepare for interviews effortlessly.
            </p>

            {/* CTA Group */}
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-7 py-3.5 text-base font-semibold text-zinc-950 shadow-xl shadow-emerald-400/25 transition hover:bg-emerald-300 hover:shadow-emerald-400/40 active:scale-98"
              >
                Start Tracking Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-6 py-3.5 text-base font-medium text-zinc-200 transition hover:bg-zinc-800 hover:text-white"
              >
                Sign In to Dashboard
              </Link>
            </div>

            {/* Key Value Metrics */}
            <div className="mt-14 grid grid-cols-2 gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm sm:grid-cols-4">
              <div>
                <div className="text-2xl font-bold text-zinc-100">10x</div>
                <div className="mt-1 text-xs text-zinc-400">Faster Pipeline Workflow</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">94%</div>
                <div className="mt-1 text-xs text-zinc-400">ATS Match Precision</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">0 Stale</div>
                <div className="mt-1 text-xs text-zinc-400">Auto Reminders & Notes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">100%</div>
                <div className="mt-1 text-xs text-zinc-400">Secure & Private Data</div>
              </div>
            </div>
          </div>

          {/* Interactive Pipeline Showcase Mockup */}
          <div className="mt-16 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-4 shadow-2xl shadow-emerald-950/20 sm:p-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-zinc-500">
                  jobtracker.ai/dashboard/pipeline
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300 font-medium">
                  <Sparkles className="h-3 w-3 text-emerald-400" /> AI Resume Copilot: Active
                </span>
              </div>
            </div>

            {/* Kanban columns preview */}
            <div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-4">
              {/* Column 1 */}
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5">
                <div className="flex items-center justify-between text-xs font-semibold uppercase text-zinc-400 mb-3">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-zinc-500"></span> Saved (3)
                  </span>
                </div>
                <div className="space-y-2.5">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-left transition hover:border-zinc-700">
                    <div className="font-semibold text-sm text-zinc-200">Staff Frontend Engineer</div>
                    <div className="text-xs text-zinc-400 mt-0.5">Stripe • Remote</div>
                    <div className="mt-2.5 flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500">$180k - $220k</span>
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-400 font-medium">
                        92% Match
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5">
                <div className="flex items-center justify-between text-xs font-semibold uppercase text-zinc-400 mb-3">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-400"></span> Applied (5)
                  </span>
                </div>
                <div className="space-y-2.5">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-left">
                    <div className="font-semibold text-sm text-zinc-200">Senior Fullstack Developer</div>
                    <div className="text-xs text-zinc-400 mt-0.5">Linear • New York</div>
                    <div className="mt-2.5 flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500">Applied 2d ago</span>
                      <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-blue-400 font-medium">
                        88% Match
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3 */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-3.5">
                <div className="flex items-center justify-between text-xs font-semibold uppercase text-emerald-400 mb-3">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> Interviewing (2)
                  </span>
                </div>
                <div className="space-y-2.5">
                  <div className="rounded-lg border border-emerald-500/40 bg-zinc-900 p-3 text-left shadow-lg shadow-emerald-950/40">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm text-zinc-100">AI Application Architect</div>
                      <span className="rounded bg-emerald-400/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                        Round 3
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">Anthropic • San Francisco</div>
                    <div className="mt-3 flex items-center justify-between text-[11px] border-t border-zinc-800 pt-2 text-zinc-400">
                      <span>Tomorrow, 2:30 PM</span>
                      <span className="text-emerald-400 font-semibold">96% Match</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 4 */}
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5">
                <div className="flex items-center justify-between text-xs font-semibold uppercase text-zinc-400 mb-3">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-400"></span> Offers (1)
                  </span>
                </div>
                <div className="space-y-2.5">
                  <div className="rounded-lg border border-amber-500/30 bg-zinc-900 p-3 text-left">
                    <div className="font-semibold text-sm text-zinc-100">Lead Software Engineer</div>
                    <div className="text-xs text-zinc-400 mt-0.5">Vercel • Remote</div>
                    <div className="mt-2.5 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-amber-300">$215,000 / yr</span>
                      <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-amber-400 font-medium">
                        Accepted
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="border-t border-zinc-900 bg-zinc-950 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Complete Feature Suite
            </h2>
            <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
              Everything you need to navigate today&apos;s competitive job market
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-7 transition hover:border-zinc-700 hover:bg-zinc-900/80"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 group-hover:border-zinc-700">
                    {item.icon}
                  </div>
                  <span className="rounded-full bg-zinc-800/80 px-2.5 py-1 text-[11px] font-medium text-zinc-300">
                    {item.badge}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-zinc-100">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="border-t border-zinc-900 bg-zinc-900/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Streamlined Workflow
            </h2>
            <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
              How JobTracker AI accelerates your journey
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((item, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-left"
              >
                <div className="text-4xl font-extrabold text-emerald-500/20">{item.step}</div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-100">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Health / Architecture Section */}
      <section id="status" className="border-t border-zinc-900 bg-zinc-950 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-400" />
                  <h2 className="text-xl font-bold text-zinc-100">Live Spring Boot & PostgreSQL Status</h2>
                </div>
                <p className="text-sm text-zinc-400 mt-1">
                  Connected to backend service via REST endpoint <code className="text-emerald-300">/api/v1/health</code>
                </p>
              </div>

              <div
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
                  isOnline
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    : healthError
                      ? "bg-red-500/10 text-red-300 border border-red-500/20"
                      : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                }`}
              >
                {isOnline ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : healthError ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <Activity className="h-4 w-4 animate-spin" />
                )}
                {isOnline ? "Backend Live & Healthy" : healthError ? "API Offline" : "Checking Connection..."}
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-zinc-950 p-4 border border-zinc-800/80">
                <dt className="text-xs uppercase font-medium text-zinc-500">Service Status</dt>
                <dd className="mt-1.5 font-bold text-zinc-200">
                  {healthLoading ? "Checking..." : healthData?.status ?? "DOWN"}
                </dd>
              </div>
              <div className="rounded-lg bg-zinc-950 p-4 border border-zinc-800/80">
                <dt className="text-xs uppercase font-medium text-zinc-500">Backend App</dt>
                <dd className="mt-1.5 font-bold text-zinc-200">{healthData?.service ?? "jobtracker-api"}</dd>
              </div>
              <div className="rounded-lg bg-zinc-950 p-4 border border-zinc-800/80">
                <dt className="text-xs uppercase font-medium text-zinc-500">Authentication</dt>
                <dd className="mt-1.5 font-bold text-emerald-400">Spring Security + JWT</dd>
              </div>
              <div className="rounded-lg bg-zinc-950 p-4 border border-zinc-800/80">
                <dt className="text-xs uppercase font-medium text-zinc-500">Database Engine</dt>
                <dd className="mt-1.5 font-bold text-blue-400">PostgreSQL 16</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="border-t border-zinc-900 bg-gradient-to-b from-zinc-950 to-zinc-900 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mb-6 border border-emerald-500/20">
            <Bot className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to supercharge your career journey?
          </h2>
          <p className="mt-4 text-base text-zinc-400 sm:text-lg">
            Create your account today and experience the modern way to organize applications, optimize
            resumes, and land your dream job.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="flex items-center gap-2 rounded-xl bg-emerald-400 px-8 py-3.5 text-base font-semibold text-zinc-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
            >
              Get Started for Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-3.5 text-base font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-10 text-xs text-zinc-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-emerald-400" />
            <span className="font-semibold text-zinc-400">JobTracker AI</span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-zinc-300">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-zinc-300">
              Register
            </Link>
            <a href="#status" className="hover:text-zinc-300">
              API Status
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
