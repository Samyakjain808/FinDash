import SummaryCards from "../components/SummaryCards";
import Charts from "../components/Charts";
import TransactionsTable from "../components/TransactionsTable";
import Insights from "../components/Insights";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import useStore from "../store/useStore";

export default function Dashboard() {
  const darkMode = useStore((s) => s.darkMode);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className={`min-h-screen flex transition-colors duration-300 ${
        darkMode ? "dark-page-bg" : "bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20"
      }`}>
        
        <Sidebar />

        
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          <Header />

          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8 max-w-7xl w-full mx-auto">
            <div id="section-dashboard">
              <SummaryCards />
            </div>

            <Charts />

            <div id="section-insights">
              <Insights />
            </div>

            <div id="section-transactions">
              <TransactionsTable />
            </div>
          </main>

          
          <footer className={`px-4 sm:px-6 lg:px-8 py-6 text-center text-xs ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
            FinDash — Finance Dashboard &copy; {new Date().getFullYear()}
          </footer>
        </div>
      </div>
    </div>
  );
}
