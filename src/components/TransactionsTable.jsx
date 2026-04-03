import { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2, ArrowUpDown, FileX, SlidersHorizontal } from "lucide-react";
import useStore, { useFilteredTransactions, useIsAdmin } from "../store/useStore";
import { formatCurrency, formatDate } from "../utils/format";
import TransactionModal from "./TransactionModal";
import toast from "react-hot-toast";

export default function TransactionsTable() {
  const filteredTransactions = useFilteredTransactions();
  const search = useStore((s) => s.search);
  const setSearch = useStore((s) => s.setSearch);
  const filterType = useStore((s) => s.filterType);
  const setFilterType = useStore((s) => s.setFilterType);
  const sortBy = useStore((s) => s.sortBy);
  const sortOrder = useStore((s) => s.sortOrder);
  const toggleSort = useStore((s) => s.toggleSort);
  const deleteTransaction = useStore((s) => s.deleteTransaction);
  const darkMode = useStore((s) => s.darkMode);
  const transactions = useStore((s) => s.transactions);
  const isAdmin = useIsAdmin();

  const [showModal, setShowModal] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const hasTransactions = transactions.length > 0;
  const hasResults = filteredTransactions.length > 0;
  const isSearching = search.trim() !== "" || filterType !== "all";

  const matchesSearch = (t) => {
    if (!search.trim()) return false;
    const q = search.toLowerCase();
    return (
      t.category.toLowerCase().includes(q) ||
      String(t.amount).includes(q) ||
      t.date.includes(q)
    );
  };

  const handleDelete = (id) => {
    deleteTransaction(id);
    setDeleteConfirm(null);
    toast.success("Transaction deleted!");
  };

  const handleEdit = (tx) => {
    setEditingTx(tx);
    setShowModal(true);
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 ml-1 inline" />;
    return (
      <span className="text-primary-500 ml-1 inline-flex">
        {sortOrder === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  return (
    <>
      <div className="glass rounded-2xl p-5 lg:p-6 animate-fade-in" id="transactions-section">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transactions</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {filteredTransactions.length} of {transactions.length} transactions
            </p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                id="transaction-search"
                className={`pl-9 pr-3 py-2 rounded-xl text-sm w-48 transition-all duration-200 focus:outline-none focus:ring-2 ${
                  darkMode
                    ? "bg-[#1e2433] border border-[#2a3348] text-gray-200 placeholder-gray-500 focus:ring-primary-500/40"
                    : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-primary-500/30"
                }`}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>

            
            <div className={`flex rounded-xl overflow-hidden border ${darkMode ? "border-[#2a3348]" : "border-gray-200"}`}>
              {["all", "income", "expense"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  id={`filter-${f}`}
                  className={`px-3 py-2 text-xs font-medium capitalize transition-all duration-200 cursor-pointer ${
                    filterType === f
                      ? f === "income"
                        ? "bg-emerald-500 text-white"
                        : f === "expense"
                          ? "bg-rose-500 text-white"
                          : "bg-primary-600 text-white"
                      : darkMode
                        ? "bg-[#1e2433] text-gray-400 hover:bg-[#252d3d]"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            
            {isAdmin && (
              <button
                onClick={() => { setEditingTx(null); setShowModal(true); }}
                id="add-transaction-btn"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-medium shadow-lg shadow-emerald-500/25 transition-all duration-200 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            )}
          </div>
        </div>

        
        <div className="overflow-x-auto -mx-5 lg:-mx-6 px-5 lg:px-6">
          <table className="w-full text-sm" id="transactions-table">
            <thead>
              <tr className={`text-left border-b ${darkMode ? "border-[#2a3348]" : "border-gray-200"}`}>
                <th className="pb-3 font-medium text-gray-500 dark:text-gray-400 cursor-pointer select-none" onClick={() => toggleSort("date")}>
                  Date <SortIcon field="date" />
                </th>
                <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Category</th>
                <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Type</th>
                <th className="pb-3 font-medium text-gray-500 dark:text-gray-400 cursor-pointer select-none text-right" onClick={() => toggleSort("amount")}>
                  Amount <SortIcon field="amount" />
                </th>
                {isAdmin && <th className="pb-3 font-medium text-gray-500 dark:text-gray-400 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {!hasResults ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="text-center py-16">
                    <div className="flex flex-col items-center">
                      {isSearching ? (
                        <>
                          <SlidersHorizontal className={`w-12 h-12 mb-3 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
                          <p className={`font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No results found</p>
                          <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                            Try adjusting your search or filter
                          </p>
                          <button
                            onClick={() => { setSearch(""); setFilterType("all"); }}
                            className="mt-3 px-4 py-1.5 rounded-lg text-xs font-medium text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors cursor-pointer"
                          >
                            Clear filters
                          </button>
                        </>
                      ) : (
                        <>
                          <FileX className={`w-12 h-12 mb-3 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
                          <p className={`font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No transactions yet</p>
                          <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                            {isAdmin ? "Click 'Add' to create your first transaction" : "No transactions to display"}
                          </p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => {
                  const highlighted = matchesSearch(t);
                  return (
                    <tr
                      key={t.id}
                      className={`border-b transition-all duration-200 ${
                        darkMode ? "border-[#1e2433] hover:bg-[#1e2433]/50" : "border-gray-100 hover:bg-gray-50/80"
                      } ${highlighted ? "search-highlight" : ""}`}
                    >
                      <td className="py-3.5 text-gray-700 dark:text-gray-300">{formatDate(t.date)}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${
                          darkMode
                            ? "bg-[#252d3d] text-gray-300 border border-[#2a3348]"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {t.category}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          t.type === "income"
                            ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-transparent dark:border-emerald-500/25"
                            : "bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-transparent dark:border-rose-500/25"
                        }`}>
                          {t.type === "income" ? "↑ Income" : "↓ Expense"}
                        </span>
                      </td>
                      <td className={`py-3.5 text-right font-semibold ${t.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                        {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                      </td>
                      {isAdmin && (
                        <td className="py-3.5 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => handleEdit(t)}
                              className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                                darkMode
                                  ? "hover:bg-[#252d3d] text-gray-500 hover:text-primary-400"
                                  : "hover:bg-gray-100 text-gray-400 hover:text-primary-500"
                              }`}
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            {deleteConfirm === t.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDelete(t.id)}
                                  className="px-2 py-1 rounded-lg bg-rose-500 text-white text-xs font-medium hover:bg-rose-600 transition-colors cursor-pointer"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                    darkMode ? "bg-[#252d3d] text-gray-300" : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(t.id)}
                                className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                                  darkMode
                                    ? "hover:bg-rose-500/15 text-gray-500 hover:text-rose-400"
                                    : "hover:bg-rose-50 text-gray-400 hover:text-rose-500"
                                }`}
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <TransactionModal
          transaction={editingTx}
          onClose={() => { setShowModal(false); setEditingTx(null); }}
        />
      )}
    </>
  );
}
