import { useQuery } from "@tanstack/react-query";
import { Activity, AlertCircle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

import { getApiHealth } from "../api/healthApi";

const HomePage = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["api-health"],
    queryFn: getApiHealth,
    retry: 1,
    refetchInterval: 30000,
  });

  const isOnline = data?.status === "UP";

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-50">
      <main className="mx-auto flex max-w-4xl flex-col gap-8">
        <section className="space-y-3">
          <div className="flex items-center gap-3 text-sm font-medium text-emerald-300">
            <Activity className="h-5 w-5" />
            Project setup
          </div>
          <h1 className="text-4xl font-semibold">AI Job Tracker</h1>
          <p className="max-w-2xl text-zinc-300">
            Frontend is running. The status panel below checks live communication with the Spring Boot API.
          </p>
          <Link
            to="/register"
            className="inline-flex h-10 items-center rounded-md bg-emerald-400 px-4 text-sm font-medium text-zinc-950 transition hover:bg-emerald-300"
          >
            Create Account
          </Link>
        </section>

        <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium">Backend API</h2>
              <p className="text-sm text-zinc-400">GET /api/v1/health</p>
            </div>

            <div
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                isOnline
                  ? "bg-emerald-500/10 text-emerald-300"
                  : error
                    ? "bg-red-500/10 text-red-300"
                    : "bg-amber-500/10 text-amber-300"
              }`}
            >
              {isOnline ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : error ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <Activity className="h-4 w-4" />
              )}
              {isOnline ? "Connected" : error ? "Unavailable" : "Checking"}
            </div>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase text-zinc-500">Status</dt>
              <dd className="mt-1 font-medium">{isLoading ? "Loading" : data?.status ?? "Unknown"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-zinc-500">Service</dt>
              <dd className="mt-1 font-medium">{data?.service ?? "jobtracker-api"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-zinc-500">Last Check</dt>
              <dd className="mt-1 font-medium">
                {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString() : "-"}
              </dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
