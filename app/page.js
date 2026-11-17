"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Users, Wallet, ArrowRight } from "lucide-react";
import Modal from "@/components/Modal";
import CreateTripForm from "@/components/CreateTripForm";
import { useTrips } from "@/context/TripContext";
export default function HomePage() {
  const { trips, loadingTrips, error, refreshTrips } = useTrips();
  const [createOpen, setCreateOpen] = useState(false);
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">TallyGo</h1>
          <p className="text-sm text-zinc-500">Split group expenses and settle up with minimum payments.</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="btn-primary"><Plus className="h-4 w-4" />Create New Trip</button>
      </header>
      {error && <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
      {loadingTrips ? (
        <div className="grid gap-4 sm:grid-cols-2">{[...Array(4)].map((_, i) => <div key={i} className="card animate-pulse"><div className="h-5 w-1/2 rounded bg-zinc-200" /><div className="mt-3 h-4 w-1/3 rounded bg-zinc-100" /></div>)}</div>
      ) : !error && trips.length === 0 ? (
        <div className="card text-center"><Wallet className="mx-auto mb-3 h-8 w-8 text-zinc-400" /><h2 className="font-bold">No trips yet</h2><p className="mt-1 text-sm text-zinc-500">Create your first trip to start tracking shared expenses.</p></div>
      ) : !error ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {trips.map((trip) => (
            <Link key={trip._id} href={`/trips/${trip._id}`} className="card group transition hover:border-emerald-300 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0"><h2 className="truncate font-bold">{trip.title}</h2><p className="mt-1 flex items-center gap-1 text-xs text-zinc-500"><Users className="h-3.5 w-3.5" />{trip.members.length} members · {trip.currency}</p></div>
                {trip.isActive && <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">Active</span>}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm font-semibold text-emerald-700">Open dashboard<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></div>
            </Link>
          ))}
        </div>
      ) : null}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New Trip"><CreateTripForm onCreated={() => { setCreateOpen(false); refreshTrips(); }} /></Modal>
    </main>
  );
}