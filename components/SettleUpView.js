"use client";
import { HandCoins, CheckCircle2 } from "lucide-react";
export default function SettleUpView({ settlements, currency }) {
  if (!settlements.length) return <div className="card text-center"><CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-emerald-500" /><h3 className="font-bold">Everyone is settled</h3><p className="text-sm text-zinc-500">No recommended transfers are needed.</p></div>;
  return (
    <div className="space-y-3">
      {settlements.map((s, i) => (
        <div key={i} className="card flex items-center gap-3">
          <span className="rounded-xl bg-emerald-100 p-2 text-emerald-700"><HandCoins className="h-4 w-4" /></span>
          <p className="text-sm font-semibold"><span className="text-rose-600">{s.from}</span> pays <span className="text-emerald-600">{s.to}</span> <span className="font-black">{currency} {s.amount.toFixed(2)}</span></p>
        </div>
      ))}
    </div>
  );
}