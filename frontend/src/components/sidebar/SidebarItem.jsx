import { NavLink } from "react-router-dom";

const SidebarItem = ({ item, onClick }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-slate-950 text-white"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
        ].join(" ")
      }
    >
      <Icon size={18} aria-hidden="true" />
      <span>{item.label}</span>
    </NavLink>
  );
};

export default SidebarItem;
