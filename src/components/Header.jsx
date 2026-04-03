import { Sun, Moon } from "lucide-react";
import useStore from "../store/useStore";
import RoleSwitcher from "../components/RoleSwitcher";

export default function Header() {
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);

  return (
    <header
      className={`sticky top-0 z-30 ${
        darkMode
          ? "bg-[#131825]/90 backdrop-blur-xl border-b border-[#2a3348]/60"
          : "glass border-b border-gray-200/50"
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left spacer for mobile hamburger */}
        <div className="w-10 lg:hidden" />

        {/* Center section - responsive greeting */}
        <div className="hidden sm:block">
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RoleSwitcher />

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            id="theme-toggle"
            className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${
              darkMode
                ? "bg-[#1e2433] hover:bg-[#252d3d] text-amber-400 border border-[#2a3348]"
                : "hover:bg-gray-100 text-gray-600 border border-transparent"
            }`}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
