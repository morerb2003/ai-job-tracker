import { Bell, BriefcaseBusiness, Menu, Search } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6">
      <div className="flex min-w-fit items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 md:hidden"
          aria-label="Open sidebar"
          title="Open sidebar"
        >
          <Menu size={20} aria-hidden="true" />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-white">
          <BriefcaseBusiness size={20} aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">AI Job Tracker</p>
          <h1 className="text-lg font-semibold text-slate-950">Dashboard</h1>
        </div>
      </div>

      <div className="hidden max-w-xl flex-1 items-center md:flex">
        <label className="relative w-full">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
            aria-hidden="true"
          />
          <span className="sr-only">Search</span>
          <input
            type="search"
            placeholder="Search jobs, companies, interviews..."
            className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
          />
        </label>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={18} aria-hidden="true" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
        </button>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-900 text-sm font-semibold text-white"
          aria-label="User profile"
          title="User profile"
        >
          RJ
        </button>
      </div>
    </header>
  );
};

export default Navbar;
