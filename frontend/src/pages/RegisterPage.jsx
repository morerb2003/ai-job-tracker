import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Loader2, UserPlus } from "lucide-react";

import { registerUser } from "../api/authApi";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

const RegisterPage = () => {
  const [form, setForm] = useState(initialForm);

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      setForm(initialForm);
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
    registerMutation.error?.response?.data?.detail ??
    registerMutation.error?.response?.data?.message ??
    registerMutation.error?.message;

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-50">
      <main className="mx-auto flex max-w-md flex-col gap-8">
        <section className="space-y-3">
          <Link to="/" className="text-sm font-medium text-emerald-300 hover:text-emerald-200">
            AI Job Tracker
          </Link>
          <h1 className="text-3xl font-semibold">Create your account</h1>
          <p className="text-zinc-300">
            Register a user in PostgreSQL through the Spring Boot authentication API.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex flex-col gap-5">
            <label className="flex flex-col gap-2 text-sm font-medium">
              Name
              <input
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-50 outline-none transition focus:border-emerald-400"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Rohit Sharma"
                required
                maxLength={120}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Email
              <input
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-50 outline-none transition focus:border-emerald-400"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="rohit@example.com"
                required
                maxLength={255}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Password
              <input
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-50 outline-none transition focus:border-emerald-400"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                required
                minLength={8}
                maxLength={72}
              />
            </label>

            <button
              className="flex h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 font-medium text-zinc-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              Register
            </button>
          </div>

          {registerMutation.isSuccess && (
            <div className="mt-5 flex gap-2 rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{registerMutation.data.message}</span>
            </div>
          )}

          {registerMutation.isError && (
            <div className="mt-5 flex gap-2 rounded-md bg-red-500/10 p-3 text-sm text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default RegisterPage;
