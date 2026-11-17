"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, ToggleLeft, ToggleRight } from "lucide-react";
import Tabs from "@/components/Tabs";
import Modal from "@/components/Modal";
import AddExpenseForm from "@/components/AddExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import BalancesView from "@/components/BalancesView";
import SettleUpView from "@/components/SettleUpView";
import { calculateSettlements } from "@/lib/settlements";
import { useTrips } from "@/context/TripContext";
const TABS = [{ id: "expenses", label: "Expenses" }, { id: "balances", label: "Balances" }, { id: "settle", label: "Settle Up" }];
export default function TripPage() {
  const { id } = useParams();
  const { getTrip, setTripActive } = useTrips();
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("expenses");
  const [addOpen, setAddOpen] = useState(false);
  const [toggling, setToggling] = useState(false);
  const loadTrip = useCallback(async () => {
    try {
      setLoading(true);
      const data = getTrip(id);
      setTrip(data.trip); setExpenses(data.expenses); setError("");
      if (data.trip.isActive) requestNotification(data.trip.title);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }, [id]);
  useEffect(() => { loadTrip(); }, [loadTrip]);
  useEffect(() => {
    const openModal = (event) => { if (event.detail?.tripId === id) setAddOpen(true); };
    window.addEventListener("trekledger:open-add-expense", openModal);
    return () => window.removeEventListener("trekledger:open-add-expense", openModal);
  }, [id]);
  const settlement = useMemo(() => calculateSettlements(expenses, trip?.members || []), [expenses, trip]);
  const totalSpent = expenses.reduce((sum, e) => sum + e.totalAmount, 0);
  const requestNotification = async (title) => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    let permission = Notification.permission;
    if (permission === "default") permission = await Notification.requestPermission();
    if (permission === "granted") new Notification(`TallyGo: ${title} is active. Tap to log an expense.`, { body: "Open TallyGo to add an expense.", tag: "trekledger-active-trip" });
  };
  const toggleActive = async () => {
    try {
      setToggling(true);
      const next = !trip.isActive;
      const updatedTrip = setTripActive(id, next);
      setTrip(updatedTrip);
      if (next) await requestNotification(updatedTrip.title);
    } catch (err) { setError(err.message); } finally { setToggling(false); }
  };
  if (loading) return <main className="mx-auto max-w-5xl px-4 py-8"><div className="card animate-pulse"><div className="h-6 w-1/2 rounded bg-zinc-200" /><div className="mt-4 h-4 w-1/3 rounded bg-zinc-100" /></div></main>;
  if (error && !trip) return <main className="mx-auto max-w-5xl px-4 py-8"><div className="card border-rose-200 bg-rose-50 text-rose-700">{error}</div></main>;
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-800"><ArrowLeft className="h-4 w-4" />All trips</Link>
      <section className="card mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black">{trip.title}</h1>
            <p className="mt-2 text-sm text-zinc-500">{trip.members.length} members · Total spent: <span className="font-bold text-zinc-800">{trip.currency} {totalSpent.toFixed(2)}</span></p>
            <div className="mt-3 flex flex-wrap gap-2">{trip.members.map((m) => <span key={m} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">{m}</span>)}</div>
          </div>
          <button onClick={toggleActive} disabled={toggling} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${trip.isActive ? "bg-emerald-600 text-white hover:bg-emerald-700" : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"}`}>
            {toggling ? <Loader2 className="h-4 w-4 animate-spin" /> : trip.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            {trip.isActive ? "Active" : "Set Active"}
          </button>
        </div>
      </section>
      {error && <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      <section className="mt-6">
        {tab === "expenses" && <ExpenseList expenses={expenses} currency={trip.currency} onDeleted={loadTrip} />}
        {tab === "balances" && <BalancesView balances={settlement.balances} currency={trip.currency} />}
        {tab === "settle" && <SettleUpView settlements={settlement.settlements} currency={trip.currency} />}
      </section>
      <button onClick={() => setAddOpen(true)} className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3.5 font-bold text-white shadow-lg transition hover:bg-emerald-700 sm:bottom-8"><Plus className="h-5 w-5" />Add Expense</button>
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Expense"><AddExpenseForm trip={trip} onCreated={() => { setAddOpen(false); loadTrip(); }} /></Modal>
    </main>
  );
}