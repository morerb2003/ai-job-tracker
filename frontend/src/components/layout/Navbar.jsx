import {
  Bell,
  Briefcase,
  LogOut,
  Menu,
  Search,
  Shield,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-4 sm:px-6 backdrop-blur-md text-zinc-100">
      {/* Left: Hamburger (Mobile) + Logo */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100 transition md:hidden"
          aria-label="Open sidebar"
          title="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link to="/overview" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-zinc-950 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Briefcase className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg tracking-tight text-zinc-50 leading-none">
              JobTracker<span className="text-emerald-400">AI</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-medium leading-tight hidden sm:block">
              Career Pipeline Platform
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex max-w-md flex-1 items-center mx-6">
        <div className="relative w-full">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
            size={16}
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search applications, companies, notes..."
            className="h-9 w-full rounded-xl border border-zinc-800 bg-zinc-900/90 pl-10 pr-4 text-xs text-zinc-200 placeholder-zinc-500 outline-none transition focus:border-emerald-500/60 focus:bg-zinc-900 focus:ring-1 focus:ring-emerald-500/30"
          />
        </div>
      </div>

      {/* Right: Notifications + User Profile + Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <button
          type="button"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100 transition"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />
        </button>

        {/* User Card */}
        <div className="flex items-center gap-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/90 px-3 py-1 text-xs">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
            {userInitial}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="font-semibold text-zinc-200 leading-tight truncate max-w-[120px]">
              {user?.name || "User"}
            </span>
            <span className="text-[10px] text-zinc-500 leading-tight truncate max-w-[120px]">
              {user?.email || "Authenticated"}
            </span>
          </div>
          <span className="hidden lg:inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
            <Shield className="h-2.5 w-2.5" />
            {user?.role || "USER"}
          </span>
        </div>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100 transition"
          title="Sign Out"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
