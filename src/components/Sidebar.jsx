import { LayoutDashboard, ArrowLeftRight, Lightbulb, BarChart3, Menu, X, RotateCcw } from "lucide-react";
import useStore from "../store/useStore";
import toast from "react-hot-toast";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "insights", label: "Insights", icon: Lightbulb },
];

export default function Sidebar() {
  const darkMode = useStore((s) => s.darkMode);
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const setSidebarOpen = useStore((s) => s.setSidebarOpen);
  const activeSection = useStore((s) => s.activeSection);
  const setActiveSection = useStore((s) => s.setActiveSection);
  const resetData = useStore((s) => s.resetData);

  const handleNav = (id) => {
    setActiveSection(id);
    setSidebarOpen(false);

    //Scroll to section
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleReset = () => {
    resetData();
    toast.success("Data reset to defaults!");
  };

  return (
    <>

      <button
        onClick={() => setSidebarOpen(true)}
        className={`lg:hidden fixed top-4 left-4 z-40 p-2 rounded-xl transition-all duration-200 cursor-pointer ${
          darkMode
            ? "bg-[#1e2433] border border-[#2a3348] text-gray-300 hover:bg-[#252d3d]"
            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm"
        }`}
        id="mobile-menu-btn"
      >
        <Menu className="w-5 h-5" />
      </button>

 
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      <aside
        className={`fixed top-0 left-0 z-50 h-full transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0 sidebar-slide-in" : "-translate-x-full"
        } w-64 lg:w-60 flex flex-col ${
          darkMode
            ? "bg-[#0f1219]/95 backdrop-blur-xl border-r border-[#2a3348]/60"
            : "bg-white/95 backdrop-blur-xl border-r border-gray-200/50"
        }`}
      >

        <div className={`flex items-center justify-between px-5 h-16 border-b ${darkMode ? "border-[#2a3348]/60" : "border-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h1 className={`text-lg font-bold tracking-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
              FinDash
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`lg:hidden p-1 rounded-lg transition-colors cursor-pointer ${darkMode ? "hover:bg-[#1e2433] text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>


        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  active
                    ? darkMode
                      ? "bg-primary-500/15 text-primary-400"
                      : "bg-primary-50 text-primary-600"
                    : darkMode
                      ? "text-gray-400 hover:bg-[#1e2433] hover:text-gray-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
                {active && (
                  <div className={`ml-auto w-1.5 h-1.5 rounded-full ${darkMode ? "bg-primary-400" : "bg-primary-500"}`} />
                )}
              </button>
            );
          })}
        </nav>


        <div className={`px-3 py-4 border-t ${darkMode ? "border-[#2a3348]/60" : "border-gray-100"}`}>
          <button
            onClick={handleReset}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
              darkMode
                ? "text-gray-500 hover:bg-[#1e2433] hover:text-gray-300"
                : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Reset to default data
          </button>
        </div>
      </aside>
    </>
  );
}
