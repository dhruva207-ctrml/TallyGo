"use client";
export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 rounded-xl bg-zinc-100 p-1">
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => onChange(tab.id)} className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${active === tab.id ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}>{tab.label}</button>
      ))}
    </div>
  );
}