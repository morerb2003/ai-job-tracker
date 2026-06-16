import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === "dark" ? Moon : Sun;

  const handleToggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    toggleTheme();
  };

  return (
    <button
      type="button"
      onClick={handleToggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  );
};

export default ThemeToggle;
