import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const initialForm = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: (credentials) => login(credentials),
    onSuccess: () => {
      setTimeout(() => {
        navigate("/");
      }, 700);
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    loginMutation.mutate(form);
  };

  const errorMessage =
    loginMutation.error?.response?.data?.message ??
    loginMutation.error?.response?.data?.detail ??
    loginMutation.error?.message;

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-zinc-50 flex flex-col justify-center items-center selection:bg-emerald-500 selection:text-zinc-950">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6 group transition hover:opacity-90"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-zinc-950 shadow-lg shadow-emerald-500/20">
              <Briefcase className="h-6 w-6 stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-100">
              JobTracker<span className="text-emerald-400">AI</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-zinc-100">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Enter your credentials to access your job applications and AI insights
          </p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 sm:p-8 shadow-xl shadow-black/40 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950 pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950 pl-10 pr-10 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-400 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Success Message */}
            {loginMutation.isSuccess && (
              <div className="flex items-center gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-300 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{loginMutation.data?.message || "Login successful! Redirecting..."}</span>
              </div>
            )}

            {/* Error Message */}
            {loginMutation.isError && (
              <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage || "Invalid email or password"}</span>
              </div>
            )}
          </form>

          {/* Footer inside card */}
          <div className="mt-6 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-400">
            Don&apos;t have an account yet?{" "}
            <Link
              to="/register"
              className="font-semibold text-emerald-400 hover:text-emerald-300 transition"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition inline-flex items-center gap-1"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
