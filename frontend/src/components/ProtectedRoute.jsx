import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mb-3" />
        <p className="text-sm font-medium">Verifying authentication session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const allowedRoles = Array.isArray(requiredRole)
    ? requiredRole
    : requiredRole
    ? [requiredRole]
    : [];

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
        <section className="max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 text-center shadow-xl">
          <ShieldAlert className="mx-auto h-10 w-10 text-amber-400" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-semibold">Access denied</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Your account does not have permission to view this page.
          </p>
          <Link
            to="/overview"
            className="mt-6 inline-flex rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
          >
            Return to dashboard
          </Link>
        </section>
      </main>
    );
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
