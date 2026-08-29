import {
  BarChart3,
  Briefcase,
  Calendar,
  FileText,
  Kanban,
  LayoutDashboard,
  LogOut,
  Settings,
  X,
  Compass,
} from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navigationItems = [
  { label: "Overview", path: "/overview", icon: LayoutDashboard },
  { label: "Applications", path: "/applications", icon: Briefcase },
  { label: "Kanban Board", path: "/kanban", icon: Kanban },
  { label: "AI Resume Analysis", path: "/ai-analysis", icon: FileText, badge: "AI" },
  { label: "Interviews", path: "/interviews", icon: Calendar },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Settings", path: "/settings", icon: Settings },
];

const Sidebar = ({ isOpen = false, onClose }) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between w-64 border-r border-zinc-800/80 bg-zinc-950 p-4 transition-transform duration-200 ease-in-out md:static md:z-auto md:min-h-[calc(100vh-64px)] md:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Mobile Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 md:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-zinc-950 font-bold text-xs">
                JT
              </div>
              <span className="font-bold text-sm text-zinc-100">Menu</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-100"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Section label */}
          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              Navigation
            </p>
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 group ${
                        isActive
                          ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shadow-sm"
                          : "text-zinc-400 hover:bg-zinc-900/90 hover:text-zinc-200 border border-transparent"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`h-4 w-4 transition-colors ${
                              isActive
                                ? "text-emerald-400"
                                : "text-zinc-500 group-hover:text-zinc-300"
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-3 pt-4 border-t border-zinc-800/80">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-3.5 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition"
          >
            <Compass className="h-4 w-4 text-zinc-500" />
            <span>Landing Page</span>
          </Link>

          {/* User card mini */}
          <div className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex flex-col truncate">
                <span className="font-semibold text-xs text-zinc-200 truncate">
                  {user?.name || "User"}
                </span>
                <span className="text-[10px] text-zinc-500 truncate">
                  {user?.email}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-red-400 transition"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
