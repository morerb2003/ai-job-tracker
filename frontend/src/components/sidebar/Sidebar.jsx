import {
  BarChart3,
  Briefcase,
  Calendar,
  X,
  FileText,
  Kanban,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import SidebarItem from "./SidebarItem";

const navigationItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Applications", path: "/applications", icon: Briefcase },
  { label: "Kanban", path: "/kanban", icon: Kanban },
  { label: "Resume Analysis", path: "/ai-analysis", icon: FileText },
  { label: "Interviews", path: "/interviews", icon: Calendar },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Settings", path: "/settings", icon: Settings },
];

const Sidebar = ({ isOpen = false, onClose }) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white p-4 transition-transform md:static md:z-auto md:block md:min-h-[calc(100vh-64px)] md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between md:hidden">
          <p className="text-sm font-semibold text-slate-950">Menu</p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600"
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <SidebarItem key={item.path} item={item} onClick={onClose} />
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
