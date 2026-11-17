"use client";
import Link from "next/link";
import { Plus, Wallet } from "lucide-react";
import { useTrips } from "@/context/TripContext";
export default function ActiveTripHUD({ children }) {
  const { activeTrip } = useTrips();
  const quickAdd = () => window.dispatchEvent(new CustomEvent("trekledger:open-add-expense", { detail: { tripId: activeTrip._id } }));
  return (
    <div className="min-h-screen pb-24">
      {children}
      {activeTrip && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <Link href={`/trips/${activeTrip._id}`} className="flex min-w-0 items-center gap-3">
              <span className="rounded-xl bg-emerald-100 p-2 text-emerald-700"><Wallet className="h-4 w-4" /></span>
              <span className="min-w-0"><span className="block truncate text-sm font-semibold">Active Trip: {activeTrip.title}</span><span className="block text-xs text-zinc-500">Total: {activeTrip.currency} {activeTrip.totalSpent.toFixed(2)}</span></span>
            </Link>
            <button onClick={quickAdd} className="btn-primary"><Plus className="h-4 w-4" />Quick Add</button>
          </div>
        </div>
      )}
    </div>
  );
}