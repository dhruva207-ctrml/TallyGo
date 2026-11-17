"use client";
import { useState } from "react";
import { Loader2, Receipt, Trash2 } from "lucide-react";
import { useTrips } from "@/context/TripContext";
export default function ExpenseList({ expenses, currency, onDeleted }) {
  const { deleteExpense } = useTrips();
  const [deletingId, setDeletingId] = useState(null);
  const remove = async (id) => {
    try {
      setDeletingId(id);
      deleteExpense(id);
      onDeleted();
    } catch (error) { alert(error.message); } finally { setDeletingId(null); }
  };
  if (!expenses.length) return <div className="card text-center"><Receipt className="mx-auto mb-3 h-8 w-8 text-zinc-400" /><h3 className="font-bold">No expenses yet</h3><p className="text-sm text-zinc-500">Add the first group expense.</p></div>;
  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <article key={expense._id} className="card">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0"><h3 className="truncate font-bold">{expense.description}</h3><p className="mt-1 text-xs text-zinc-500">Paid by <span className="font-semibold">{expense.paidBy}</span> · {new Date(expense.date).toLocaleDateString()}</p></div>
            <div className="text-right"><p className="font-black">{currency} {expense.totalAmount.toFixed(2)}</p>
              <button onClick={() => remove(expense._id)} disabled={deletingId === expense._id} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700">
                {deletingId === expense._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}Delete
              </button></div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {expense.splits.map((split) => <span key={`${expense._id}-${split.member}`} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">{split.member}: {currency} {split.amountOwed.toFixed(2)}{split.percentage != null ? ` (${split.percentage}%)` : ""}</span>)}
          </div>
        </article>
      ))}
    </div>
  );
}