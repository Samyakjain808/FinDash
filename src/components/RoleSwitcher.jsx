import { Shield, Eye } from "lucide-react";
import useStore from "../store/useStore";

export default function RoleSwitcher() {
  const role = useStore((s) => s.role);
  const setRole = useStore((s) => s.setRole);
  const darkMode = useStore((s) => s.darkMode);

  return (
    <div className="flex items-center gap-1.5">
      <div className={`flex rounded-xl overflow-hidden border ${
        darkMode ? "border-[#2a3348]" : "border-gray-200"
      }`}>
        <button
          onClick={() => setRole("admin")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
            role === "admin"
              ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm"
              : darkMode
                ? "bg-[#1e2433] text-gray-400 hover:text-gray-200"
                : "bg-white text-gray-500 hover:text-gray-700"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Admin
        </button>
        <button
          onClick={() => setRole("viewer")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
            role === "viewer"
              ? "bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-sm"
              : darkMode
                ? "bg-[#1e2433] text-gray-400 hover:text-gray-200"
                : "bg-white text-gray-500 hover:text-gray-700"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Viewer
        </button>
      </div>

      
      <div className={`w-2 h-2 rounded-full pulse-dot ${role === "admin" ? "bg-primary-500" : "bg-violet-500"}`} />
    </div>
  );
}
