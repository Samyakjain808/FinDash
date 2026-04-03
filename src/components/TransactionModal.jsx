import { useState, useEffect, useRef } from "react";
import { Calendar, DollarSign, Tag, ArrowUpDown } from "lucide-react";
import useStore from "../store/useStore";
import { CATEGORIES } from "../data/mockData";
import Modal from "./Modal";
import toast from "react-hot-toast";

const emptyForm = { date: "", amount: "", category: "Food", type: "expense" };

export default function TransactionModal({ transaction, onClose }) {
  const darkMode = useStore((s) => s.darkMode);
  const addTransaction = useStore((s) => s.addTransaction);
  const updateTransaction = useStore((s) => s.updateTransaction);
  const isEditing = !!transaction;

  const [form, setForm] = useState(
    transaction
      ? { date: transaction.date, amount: String(transaction.amount), category: transaction.category, type: transaction.type }
      : emptyForm
  );
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const dateRef = useRef(null);

  useEffect(() => {
    if (dateRef.current) dateRef.current.focus();
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.date) errs.date = "Date is required";
    if (!form.amount || Number(form.amount) <= 0) errs.amount = "Amount must be greater than 0";
    if (!form.category) errs.category = "Select a category";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    const errs = validate();
    if (errs[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: errs[e.target.name] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setTouched({ date: true, amount: true, category: true });
      return;
    }

    const payload = { ...form, amount: Number(form.amount) };

    if (isEditing) {
      updateTransaction({ ...payload, id: transaction.id });
      toast.success("Transaction updated!");
    } else {
      addTransaction(payload);
      toast.success("Transaction added!");
    }
    onClose();
  };

  const inputClass = (field) =>
    `w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
      darkMode
        ? `bg-[#1e2433] text-gray-200 placeholder-gray-500 ${
            errors[field] && touched[field]
              ? "ring-2 ring-rose-500/50 border-rose-500/50"
              : "border-[#2a3348] focus:ring-primary-500/40 focus:border-primary-500/40"
          } border`
        : `bg-gray-50 text-gray-900 placeholder-gray-400 ${
            errors[field] && touched[field]
              ? "ring-2 ring-rose-500/30 border-rose-400"
              : "border-gray-200 focus:ring-primary-500/30 focus:border-primary-400"
          } border`
    }`;

  return (
    <Modal title={isEditing ? "Edit Transaction" : "Add Transaction"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
       
        <div>
          <label className={`flex items-center gap-1.5 text-xs font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            <Calendar className="w-3.5 h-3.5" /> Date
          </label>
          <input
            ref={dateRef}
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass("date")}
          />
          {errors.date && touched.date && (
            <p className="mt-1 text-xs text-rose-500">{errors.date}</p>
          )}
        </div>

       
        <div>
          <label className={`flex items-center gap-1.5 text-xs font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            <DollarSign className="w-3.5 h-3.5" /> Amount (₹)
          </label>
          <input
            name="amount"
            type="number"
            min="1"
            value={form.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter amount"
            className={inputClass("amount")}
          />
          {errors.amount && touched.amount && (
            <p className="mt-1 text-xs text-rose-500">{errors.amount}</p>
          )}
        </div>

      
        <div>
          <label className={`flex items-center gap-1.5 text-xs font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            <Tag className="w-3.5 h-3.5" /> Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass("category")}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && touched.category && (
            <p className="mt-1 text-xs text-rose-500">{errors.category}</p>
          )}
        </div>

      
        <div>
          <label className={`flex items-center gap-1.5 text-xs font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            <ArrowUpDown className="w-3.5 h-3.5" /> Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {["income", "expense"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: t }))}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer capitalize ${
                  form.type === t
                    ? t === "income"
                      ? "bg-emerald-500/15 text-emerald-500 ring-2 ring-emerald-500/30"
                      : "bg-rose-500/15 text-rose-500 ring-2 ring-rose-500/30"
                    : darkMode
                      ? "bg-[#1e2433] text-gray-400 hover:bg-[#252d3d] border border-[#2a3348]"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {t === "income" ? "↑ " : "↓ "}{t}
              </button>
            ))}
          </div>
        </div>

      
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              darkMode
                ? "bg-[#252d3d] text-gray-300 hover:bg-[#2a3348]"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg shadow-primary-500/25 cursor-pointer"
          >
            {isEditing ? "Update" : "Add Transaction"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
