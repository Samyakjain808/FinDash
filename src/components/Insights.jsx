import { useMemo } from "react";
import { TrendingUp, TrendingDown, PiggyBank, BarChart3, ArrowUp, ArrowDown } from "lucide-react";
import useStore from "../store/useStore";
import { formatCurrency } from "../utils/format";

export default function Insights() {
  const transactions = useStore((s) => s.transactions);
  const darkMode = useStore((s) => s.darkMode);

  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    const expenses = transactions.filter((t) => t.type === "expense");
    const incomes = transactions.filter((t) => t.type === "income");

    // Category breakdown
    const categoryMap = {};
    expenses.forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });
    const sortedCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
    const highestCategory = sortedCategories[0];
    const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0);

    // Monthly breakdowns
    const monthlyExpenses = {};
    const monthlyIncome = {};
    transactions.forEach((t) => {
      const key = t.date.slice(0, 7);
      if (t.type === "expense") monthlyExpenses[key] = (monthlyExpenses[key] || 0) + t.amount;
      else monthlyIncome[key] = (monthlyIncome[key] || 0) + t.amount;
    });

    const sortedMonths = Object.keys({ ...monthlyExpenses, ...monthlyIncome }).sort();
    const currentMonth = sortedMonths[sortedMonths.length - 1];
    const lastMonth = sortedMonths.length > 1 ? sortedMonths[sortedMonths.length - 2] : null;

    const currentExpense = monthlyExpenses[currentMonth] || 0;
    const lastExpense = lastMonth ? (monthlyExpenses[lastMonth] || 0) : 0;
    const expenseChange = lastExpense > 0 ? ((currentExpense - lastExpense) / lastExpense) * 100 : 0;

    const currentIncome = monthlyIncome[currentMonth] || 0;
    const lastIncome = lastMonth ? (monthlyIncome[lastMonth] || 0) : 0;
    const incomeChange = lastIncome > 0 ? ((currentIncome - lastIncome) / lastIncome) * 100 : 0;

    const totalInc = incomes.reduce((s, t) => s + t.amount, 0);
    const savingsRate = totalInc > 0 ? ((totalInc - totalExpenses) / totalInc) * 100 : 0;

    // Top category percentage
    const topCategoryPct = highestCategory && totalExpenses > 0
      ? ((highestCategory[1] / totalExpenses) * 100).toFixed(1)
      : 0;

    const monthLabel = (m) => {
      if (!m) return "";
      try {
        const d = new Date(m + "-01");
        if (isNaN(d.getTime())) return m;
        return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
      } catch {
        return m;
      }
    };

    return {
      highestCategory,
      topCategoryPct,
      currentMonthLabel: monthLabel(currentMonth),
      lastMonthLabel: monthLabel(lastMonth),
      currentExpense,
      lastExpense,
      expenseChange,
      incomeChange,
      currentIncome,
      savingsRate,
      sortedCategories: sortedCategories.slice(0, 5),
      totalExpenses,
    };
  }, [transactions]);

  if (!insights) {
    return (
      <div className="glass rounded-2xl p-5 lg:p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Insights</h3>
        <p className="text-gray-400 text-center py-6">Add transactions to see insights</p>
      </div>
    );
  }

  const cards = [
    {
      icon: TrendingDown,
      title: "Top Spending Category",
      value: insights.highestCategory ? insights.highestCategory[0] : "N/A",
      detail: insights.highestCategory ? `${formatCurrency(insights.highestCategory[1])} (${insights.topCategoryPct}% of total)` : "",
      color: "text-rose-500 dark:text-rose-400",
      bgLight: "bg-rose-50 border border-rose-100",
      bgDark: "bg-rose-500/10 border border-rose-500/20",
      iconBg: "bg-rose-100 dark:bg-rose-500/20",
    },
    {
      icon: BarChart3,
      title: "Monthly Comparison",
      value: insights.expenseChange !== 0
        ? `${insights.expenseChange > 0 ? "+" : ""}${insights.expenseChange.toFixed(1)}%`
        : "—",
      detail: insights.lastMonthLabel
        ? `${insights.lastMonthLabel} → ${insights.currentMonthLabel}`
        : "Not enough data",
      subDetail: insights.lastMonthLabel
        ? `${formatCurrency(insights.lastExpense)} → ${formatCurrency(insights.currentExpense)}`
        : "",
      color: insights.expenseChange > 0 ? "text-rose-500 dark:text-rose-400" : "text-emerald-500 dark:text-emerald-400",
      bgLight: insights.expenseChange > 0 ? "bg-rose-50 border border-rose-100" : "bg-emerald-50 border border-emerald-100",
      bgDark: insights.expenseChange > 0
        ? "bg-rose-500/10 border border-rose-500/20"
        : "bg-emerald-500/10 border border-emerald-500/20",
      iconBg: insights.expenseChange > 0 ? "bg-rose-100 dark:bg-rose-500/20" : "bg-emerald-100 dark:bg-emerald-500/20",
      trendIcon: insights.expenseChange > 0 ? ArrowUp : ArrowDown,
    },
    {
      icon: PiggyBank,
      title: "Savings Rate",
      value: `${insights.savingsRate.toFixed(1)}%`,
      detail: insights.savingsRate >= 20 ? "Healthy savings! 🎉" : insights.savingsRate >= 10 ? "Room to improve" : "Try to save more ⚠️",
      color: insights.savingsRate >= 20 ? "text-emerald-500 dark:text-emerald-400" : insights.savingsRate >= 10 ? "text-amber-500 dark:text-amber-400" : "text-rose-500 dark:text-rose-400",
      bgLight: insights.savingsRate >= 20 ? "bg-emerald-50 border border-emerald-100" : insights.savingsRate >= 10 ? "bg-amber-50 border border-amber-100" : "bg-rose-50 border border-rose-100",
      bgDark: insights.savingsRate >= 20
        ? "bg-emerald-500/10 border border-emerald-500/20"
        : insights.savingsRate >= 10
          ? "bg-amber-500/10 border border-amber-500/20"
          : "bg-rose-500/10 border border-rose-500/20",
      iconBg: insights.savingsRate >= 20 ? "bg-emerald-100 dark:bg-emerald-500/20" : insights.savingsRate >= 10 ? "bg-amber-100 dark:bg-amber-500/20" : "bg-rose-100 dark:bg-rose-500/20",
      progressValue: Math.min(insights.savingsRate, 100),
      progressColor: insights.savingsRate >= 20 ? "#10b981" : insights.savingsRate >= 10 ? "#f59e0b" : "#f43f5e",
    },
  ];

  // Generate observation
  let observation = "";
  let observationIcon = "📊";
  if (insights.expenseChange > 20) {
    observation = `Spending increased by ${insights.expenseChange.toFixed(0)}% this month. Consider reviewing your ${insights.highestCategory?.[0] || "expenses"} spending.`;
    observationIcon = "⚠️";
  } else if (insights.expenseChange < -10) {
    observation = `Great job! Spending decreased by ${Math.abs(insights.expenseChange).toFixed(0)}% compared to last month.`;
    observationIcon = "✅";
  } else if (insights.savingsRate > 30) {
    observation = `You're saving ${insights.savingsRate.toFixed(0)}% of your income — excellent financial discipline!`;
    observationIcon = "🎉";
  } else if (insights.savingsRate < 10) {
    observation = `Your savings rate is ${insights.savingsRate.toFixed(0)}%. Consider cutting back on ${insights.highestCategory?.[0] || "expenses"}.`;
    observationIcon = "💡";
  } else {
    observation = `Your finances are on track. Top spending: ${insights.highestCategory?.[0] || "N/A"} at ${insights.topCategoryPct}%.`;
  }

  return (
    <div className="glass rounded-2xl p-5 lg:p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Financial Insights</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 stagger">
        {cards.map((card) => {
          const Icon = card.icon;
          const TrendIcon = card.trendIcon;

          return (
            <div key={card.title} className={`rounded-xl p-4 animate-fade-in transition-all duration-200 hover:scale-[1.02] ${darkMode ? card.bgDark : card.bgLight}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg ${card.iconBg}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{card.title}</span>
              </div>

              <div className="flex items-end gap-2 mb-1">
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                {TrendIcon && (
                  <TrendIcon className={`w-4 h-4 mb-1 ${card.color}`} />
                )}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">{card.detail}</p>
              {card.subDetail && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{card.subDetail}</p>
              )}

              {/* Mini progress bar for savings */}
              {card.progressValue !== undefined && (
                <div className={`mt-3 h-1.5 rounded-full overflow-hidden ${darkMode ? "bg-[#252d3d]" : "bg-gray-200"}`}>
                  <div
                    className="h-full rounded-full progress-bar"
                    style={{ width: `${card.progressValue}%`, background: card.progressColor }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Observation card */}
      <div className={`rounded-xl p-4 ${darkMode ? "bg-[#1e2433] border border-[#2a3348]" : "bg-gray-50 border border-gray-200"}`}>
        <div className="flex items-start gap-3">
          <span className="text-xl">{observationIcon}</span>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Smart Observation</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{observation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
