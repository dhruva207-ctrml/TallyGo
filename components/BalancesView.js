"use client";
import { Scale } from "lucide-react";
export default function BalancesView({ balances, currency }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Object.entries(balances).map(([member, balance]) => (
        <div key={member} className="card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`rounded-xl p-2 ${balance >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}><Scale className="h-4 w-4" /></span>
            <span className="font-bold">{member}</span>
          </div>
          <span className={`font-black ${balance >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{balance >= 0 ? "+" : "-"}{currency} {Math.abs(balance).toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}