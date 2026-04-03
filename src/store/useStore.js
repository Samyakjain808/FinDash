import { create } from "zustand";
import { useShallow } from "zustand/shallow";
import { useMemo } from "react";
import { mockTransactions } from "../data/mockData";

function loadTransactions() {
  try {
    const stored = localStorage.getItem("transactions");
    if (stored) return JSON.parse(stored);
  } catch {}
  return mockTransactions;
}

function persist(transactions) {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

const useStore = create((set, get) => ({
  
  transactions: loadTransactions(),

  addTransaction: (tx) => {
    const newTx = { ...tx, id: Date.now() + Math.random() };
    set((s) => {
      const txs = [newTx, ...s.transactions];
      persist(txs);
      return { transactions: txs };
    });
  },

  updateTransaction: (tx) => {
    set((s) => {
      const txs = s.transactions.map((t) => (t.id === tx.id ? tx : t));
      persist(txs);
      return { transactions: txs, editingTransaction: null };
    });
  },

  deleteTransaction: (id) => {
    set((s) => {
      const txs = s.transactions.filter((t) => t.id !== id);
      persist(txs);
      return { transactions: txs };
    });
  },

  resetData: () => {
    localStorage.removeItem("transactions");
    set({ transactions: mockTransactions });
  },

  search: "",
  filterType: "all",
  sortBy: "date",
  sortOrder: "desc",

  setSearch: (search) => set({ search }),
  setFilterType: (filterType) => set({ filterType }),
  setSort: (sortBy, sortOrder) => set({ sortBy, sortOrder }),
  toggleSort: (field) => {
    const { sortBy, sortOrder } = get();
    set({
      sortBy: field,
      sortOrder: sortBy === field && sortOrder === "desc" ? "asc" : "desc",
    });
  },


  role: "admin",
  setRole: (role) => set({ role }),


  darkMode: localStorage.getItem("darkMode") !== "false",
  toggleDarkMode: () => {
    set((s) => {
      const newVal = !s.darkMode;
      localStorage.setItem("darkMode", String(newVal));
      return { darkMode: newVal };
    });
  },


  editingTransaction: null,
  setEditing: (tx) => set({ editingTransaction: tx }),

  modalOpen: false,
  setModalOpen: (open) => set({ modalOpen: open }),

  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  activeSection: "dashboard",
  setActiveSection: (section) => set({ activeSection: section }),
}));


export function useFilteredTransactions() {
  const transactions = useStore((s) => s.transactions);
  const filterType = useStore((s) => s.filterType);
  const search = useStore((s) => s.search);
  const sortBy = useStore((s) => s.sortBy);
  const sortOrder = useStore((s) => s.sortOrder);

  return useMemo(() => {
    let txs = [...transactions];

    if (filterType !== "all") {
      txs = txs.filter((t) => t.type === filterType);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      txs = txs.filter(
        (t) =>
          t.category.toLowerCase().includes(q) ||
          String(t.amount).includes(q) ||
          t.date.includes(q)
      );
    }

    txs.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "date") cmp = new Date(a.date) - new Date(b.date);
      else if (sortBy === "amount") cmp = a.amount - b.amount;
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return txs;
  }, [transactions, filterType, search, sortBy, sortOrder]);
}

export function useTotals() {
  const transactions = useStore((s) => s.transactions);

  return useMemo(() => {
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    return { totalIncome, totalExpenses, totalBalance: totalIncome - totalExpenses };
  }, [transactions]);
}

export const useIsAdmin = () => useStore((s) => s.role === "admin");

export default useStore;
