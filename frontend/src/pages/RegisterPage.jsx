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
  Loader2,
  Lock,
  Mail,
  User,
  UserPlus,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);

  const registerMutation = useMutation({
    mutationFn: (credentials) => register(credentials),
    onSuccess: () => {
      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    registerMutation.mutate(form);
  };

  const errorMessage =
    registerMutation.error?.response?.data?.message ??
    registerMutation.error?.response?.data?.detail ??
    registerMutation.error?.message;

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
            Create your account
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Join JobTracker AI to organize your career search and boost interview conversions
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 sm:p-8 shadow-xl shadow-black/40 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  name="name"
                  required
                  maxLength={120}
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Rohit Sharma"
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950 pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>

            {/* Email Address */}
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
                  maxLength={255}
                  value={form.email}
                  onChange={handleChange}
                  placeholder="rohit@example.com"
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950 pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  minLength={8}
                  maxLength={72}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
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
              disabled={registerMutation.isPending}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-400 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Success Alert */}
            {registerMutation.isSuccess && (
              <div className="flex items-center gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-300 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{registerMutation.data?.message || "Registration successful! Redirecting..."}</span>
              </div>
            )}

            {/* Error Alert */}
            {registerMutation.isError && (
              <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage || "Registration failed. Please try again."}</span>
              </div>
            )}
          </form>

          {/* Footer inside card */}
          <div className="mt-6 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-400 hover:text-emerald-300 transition"
            >
              Sign In
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

export default RegisterPage;
