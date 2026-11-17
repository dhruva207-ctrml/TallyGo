"use client";
import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useTrips } from "@/context/TripContext";
const MODES = ["EQUAL", "EXACT", "PERCENTAGE"];
export default function AddExpenseForm({ trip, onCreated }) {
  const { createExpense } = useTrips();
  const [description, setDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paidBy, setPaidBy] = useState(trip.members[0] || "");
  const [splitType, setSplitType] = useState("EQUAL");
  const [selected, setSelected] = useState([...trip.members]);
  const [exact, setExact] = useState(Object.fromEntries(trip.members.map((m) => [m, ""])));
  const [percentages, setPercentages] = useState(Object.fromEntries(trip.members.map((m) => [m, ""])));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const total = Number(totalAmount || 0);
  const exactSum = useMemo(() => Object.values(exact).reduce((s, v) => s + (Number(v) || 0), 0), [exact]);
  const percentageSum = useMemo(() => Object.values(percentages).reduce((s, v) => s + (Number(v) || 0), 0), [percentages]);
  const exactValid = splitType !== "EXACT" || (total > 0 && Math.abs(exactSum - total) <= 0.009);
  const percentageValid = splitType !== "PERCENTAGE" || Math.abs(percentageSum - 100) <= 0.01;
  const equalValid = splitType !== "EQUAL" || selected.length > 0;
  const canSubmit = description.trim() && total > 0 && paidBy && equalValid && exactValid && percentageValid && !loading;
  const toggleMember = (member) => setSelected((c) => c.includes(member) ? c.filter((m) => m !== member) : [...c, member]);
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const payload = { description, totalAmount: total, paidBy, splitType };
      if (splitType === "EQUAL") payload.selectedMembers = selected;
      else payload.splits = trip.members.map((member) => ({ member, amountOwed: Number(exact[member] || 0), percentage: Number(percentages[member] || 0) }));
      onCreated(createExpense(trip._id, payload));
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-5">
      {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      <div><label className="mb-1 block text-sm font-semibold">Description</label><input className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Dinner, fuel, hotel" required /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="mb-1 block text-sm font-semibold">Total amount</label><input type="number" min="0.01" step="0.01" className="input" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} required /></div>
        <div><label className="mb-1 block text-sm font-semibold">Paid by</label>
          <select className="input" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>{trip.members.map((m) => <option key={m} value={m}>{m}</option>)}</select></div>
      </div>
      <div><label className="mb-2 block text-sm font-semibold">Split mode</label>
        <div className="flex gap-1 rounded-xl bg-zinc-100 p-1">
          {MODES.map((mode) => <button key={mode} type="button" onClick={() => setSplitType(mode)} className={`flex-1 rounded-lg px-2 py-2 text-xs font-bold transition ${splitType === mode ? "bg-white shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}>{mode}</button>)}
        </div>
      </div>
      {splitType === "EQUAL" && (
        <div className="space-y-2">
          {trip.members.map((member) => (
            <label key={member} className="flex items-center justify-between rounded-xl border border-zinc-200 p-3">
              <span className="text-sm font-semibold">{member}</span>
              <input type="checkbox" className="h-5 w-5 accent-emerald-600" checked={selected.includes(member)} onChange={() => toggleMember(member)} />
            </label>
          ))}
          {selected.length > 0 && total > 0 && <p className="text-sm text-emerald-700">Each selected member owes {trip.currency} {(total / selected.length).toFixed(2)}</p>}
        </div>
      )}
      {splitType === "EXACT" && (
        <div className="space-y-2">
          {trip.members.map((member) => (
            <div key={member} className="flex items-center gap-3">
              <span className="w-28 truncate text-sm font-semibold">{member}</span>
              <input type="number" min="0" step="0.01" className="input" value={exact[member]} onChange={(e) => setExact((c) => ({ ...c, [member]: e.target.value }))} />
            </div>
          ))}
          <div className={`rounded-xl p-3 text-sm font-semibold ${exactValid ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>Allocated: {trip.currency} {exactSum.toFixed(2)} · Remaining: {trip.currency} {(total - exactSum).toFixed(2)}</div>
        </div>
      )}
      {splitType === "PERCENTAGE" && (
        <div className="space-y-2">
          {trip.members.map((member) => (
            <div key={member} className="flex items-center gap-3">
              <span className="w-28 truncate text-sm font-semibold">{member}</span>
              <input type="number" min="0" max="100" step="0.01" className="input" value={percentages[member]} onChange={(e) => setPercentages((c) => ({ ...c, [member]: e.target.value }))} />
              <span className="w-24 text-right text-xs text-zinc-500">{trip.currency} {((total * Number(percentages[member] || 0)) / 100).toFixed(2)}</span>
            </div>
          ))}
          <div className={`rounded-xl p-3 text-sm font-semibold ${percentageValid ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>Total: {percentageSum.toFixed(2)}% · Must equal 100%</div>
        </div>
      )}
      <button type="submit" disabled={!canSubmit} className="btn-primary w-full">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save expense"}</button>
    </form>
  );
}