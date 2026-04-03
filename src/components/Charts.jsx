import { useMemo } from "react";
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell,
} from "recharts";
import useStore from "../store/useStore";
import { CHART_COLORS } from "../data/mockData";
import { formatCurrency } from "../utils/format";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Charts() {
  const transactions = useStore((s) => s.transactions);
  const darkMode = useStore((s) => s.darkMode);

  // Monthly income vs expenses with cumulative balance
  const monthlyData = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!map[key]) map[key] = { month: MONTHS[d.getMonth()], income: 0, expenses: 0 };
      if (t.type === "income") map[key].income += t.amount;
      else map[key].expenses += t.amount;
    });

    let cumu =0;
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => {
        cumu += v.income - v.expenses;
        return { ...v, balance: cumu };
      });
  }, [transactions]);

  // Category breakdown (expenses only)
  const categoryData = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    const total = Object.values(map).reduce((s, v) => s + v, 0);
    return Object.entries(map)
      .map(([name, value]) => ({ name, value, pct: total > 0 ? ((value / total) * 100).toFixed(1) : 0 }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const gridColor = darkMode ? "#2a3348" : "#e2e8f0";
  const axisColor = darkMode ? "#64748b" : "#94a3b8";

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className={`rounded-xl p-3 shadow-xl text-sm ${
        darkMode
          ? "bg-[#1e2433] border border-[#2a3348] text-gray-200"
          : "bg-white/95 backdrop-blur border border-gray-200 text-gray-800"
      }`}>
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} className="flex items-center gap-2" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  };

  const PieTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className={`rounded-xl p-3 shadow-xl text-sm ${
        darkMode
          ? "bg-[#1e2433] border border-[#2a3348] text-gray-200"
          : "bg-white/95 backdrop-blur border border-gray-200 text-gray-800"
      }`}>
        <p className="font-semibold">{payload[0].name}</p>
        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
          {formatCurrency(payload[0].value)} ({payload[0].payload.pct}%)
        </p>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
      {/* Area Chart - Income vs Expenses with Balance Line */}
      <div className="lg:col-span-3 glass rounded-2xl p-5 lg:p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Income vs Expenses</h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Income
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Expenses
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-0.5 bg-primary-400 rounded" style={{ width: 12 }} /> Balance
            </span>
          </div>
        </div>
        {monthlyData.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No data to display</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: axisColor }} stroke={axisColor} />
              <YAxis tick={{ fontSize: 12, fill: axisColor }} stroke={axisColor} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2.5} fill="url(#incomeGrad)" dot={{ r: 4, fill: "#10b981" }} activeDot={{ r: 6 }} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" strokeWidth={2.5} fill="url(#expenseGrad)" dot={{ r: 4, fill: "#f43f5e" }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="balance" name="Balance" stroke="#60a5fa" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Donut Chart */}
      <div className="lg:col-span-2 glass rounded-2xl p-5 lg:p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
        {categoryData.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No expenses yet</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  stroke={darkMode ? "#171c28" : "#fff"}
                  strokeWidth={2}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend with mini progress bars */}
            <div className="space-y-2 mt-3">
              {categoryData.slice(0, 5).map((c, i) => (
                <div key={c.name} className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span className="text-xs text-gray-600 dark:text-gray-400 w-24 truncate">{c.name}</span>
                  <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${darkMode ? "bg-[#252d3d]" : "bg-gray-100"}`}>
                    <div
                      className="h-full rounded-full progress-bar"
                      style={{ width: `${c.pct}%`, background: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-10 text-right">{c.pct}%</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
