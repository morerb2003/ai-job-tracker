import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Loader2, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { getAdminUsers } from "../../api/adminApi";

const formatDate = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const AdminUsersPage = () => {
  const {
    data: users = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: getAdminUsers,
  });

  const adminCount = users.filter((user) => user.role === "ADMIN").length;

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Administrator tools
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
            User administration
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Review account roles and registration activity. Password data is never exposed here.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
          Refresh
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between text-sm text-zinc-400">
            Registered accounts
            <Users className="h-4 w-4 text-sky-400" aria-hidden="true" />
          </div>
          <p className="mt-3 text-3xl font-bold text-zinc-100">{isLoading ? "—" : users.length}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between text-sm text-zinc-400">
            Administrator accounts
            <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          </div>
          <p className="mt-3 text-3xl font-bold text-zinc-100">{isLoading ? "—" : adminCount}</p>
        </div>
      </div>

      {error ? (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Could not load user accounts.</p>
            <p className="mt-1 text-red-200/80">
              {error.response?.status === 403
                ? "Your account is not authorized for administrator tools."
                : error.response?.data?.message || "Check the API connection and try again."}
            </p>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-zinc-100">Accounts</h2>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 p-10 text-sm text-zinc-400">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-400" aria-hidden="true" />
            Loading accounts…
          </div>
        ) : users.length === 0 ? (
          <p className="p-10 text-center text-sm text-zinc-400">No user accounts were found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-zinc-950/70 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Name</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Email</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Role</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {users.map((user) => (
                  <tr key={user.id} className="text-zinc-300">
                    <td className="px-5 py-4 font-medium text-zinc-100">{user.name}</td>
                    <td className="px-5 py-4">{user.email}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${user.role === "ADMIN" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-zinc-700 bg-zinc-800 text-zinc-300"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-zinc-400">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-xs leading-5 text-zinc-500">
        Role changes are not available in the browser. Grant administrator access through a controlled operator process.
      </p>
    </section>
  );
};

export default AdminUsersPage;
