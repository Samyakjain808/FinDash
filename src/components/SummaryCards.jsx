import { useMemo } from "react";
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import useStore, { useTotals } from "../store/useStore";
import { formatCurrency } from "../utils/format";

const cards = [
  {
    key: "balance",
    label: "Total Balance",
    icon: Wallet,
    gradient: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50",
    bgDark: "dark:bg-blue-500/15",
    textColor: "text-blue-600 dark:text-blue-400",
    glow: "glow-blue",
  },
  {
    key: "income",
    label: "Total Income",
    icon: TrendingUp,
    gradient: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50",
    bgDark: "dark:bg-emerald-500/15",
    textColor: "text-emerald-600 dark:text-emerald-400",
    glow: "glow-emerald",
  },
  {
    key: "expenses",
    label: "Total Expenses",
    icon: TrendingDown,
    gradient: "from-rose-500 to-pink-600",
    bgLight: "bg-rose-50",
    bgDark: "dark:bg-rose-500/15",
    textColor: "text-rose-600 dark:text-rose-400",
    glow: "glow-rose",
  },
];

export default function SummaryCards() {
  const { totalBalance, totalIncome, totalExpenses } = useTotals();
  const transactions = useStore((s) => s.transactions);


  const trends = useMemo(() => {
    const monthMap = {};
    transactions.forEach((t) => {
      const key = t.date.slice(0, 7);
      if (!monthMap[key]) monthMap[key] = { income: 0, expenses: 0 };
      if (t.type === "income") monthMap[key].income += t.amount;
      else monthMap[key].expenses += t.amount;
    });

    const months = Object.keys(monthMap).sort();
    if (months.length < 2) return { balance: null, income: null, expenses: null };

    const curr = monthMap[months[months.length - 1]];
    const prev = monthMap[months[months.length - 2]];

    const currBalance = curr.income - curr.expenses;
    const prevBalance = prev.income - prev.expenses;

    const pct = (c, p) => (p > 0 ? ((c - p) / p) * 100 : c > 0 ? 100 : 0);

    return {
      balance: { value: pct(currBalance, prevBalance), up: currBalance >= prevBalance },
      income: { value: pct(curr.income, prev.income), up: curr.income >= prev.income },
      expenses: { value: pct(curr.expenses, prev.expenses), up: curr.expenses > prev.expenses },
    };
  }, [transactions]);

  const values = { balance: totalBalance, income: totalIncome, expenses: totalExpenses };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 stagger">
      {cards.map((card) => {
        const trend = trends[card.key];
        const Icon = card.icon;
        const isExpense = card.key === "expenses";
        const trendGood = isExpense ? !trend?.up : trend?.up;

        return (
          <div
            key={card.key}
            className={`animate-fade-in card-hover glass rounded-2xl p-5 lg:p-6 relative overflow-hidden ${card.glow}`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`} />

            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${card.bgLight} ${card.bgDark}`}>
                <Icon className={`w-6 h-6 ${card.textColor}`} />
              </div>

             
              {trend && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                  trendGood
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                    : "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"
                }`}>
                  {trendGood ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {Math.abs(trend.value).toFixed(1)}%
                </div>
              )}
            </div>

            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{card.label}</p>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {formatCurrency(values[card.key])}
            </p>
            {trend && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">vs last month</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
