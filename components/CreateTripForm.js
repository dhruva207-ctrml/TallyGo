"use client";
import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useTrips } from "@/context/TripContext";
export default function CreateTripForm({ onCreated }) {
  const { createTrip } = useTrips();
  const [title, setTitle] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [members, setMembers] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const updateMember = (index, value) => setMembers((c) => c.map((m, i) => (i === index ? value : m)));
  const addMember = () => setMembers((c) => [...c, ""]);
  const removeMember = (index) => setMembers((c) => (c.length === 1 ? [""] : c.filter((_, i) => i !== index)));
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError("");
    try {
      onCreated(createTrip({ title, currency, members }));
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  const valid = title.trim().length > 0 && members.some((m) => m.trim().length > 0);
  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      <div><label className="mb-1 block text-sm font-semibold">Trip title</label><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Goa Trip" required /></div>
      <div><label className="mb-1 block text-sm font-semibold">Currency</label>
        <select className="input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="INR">INR — ₹</option><option value="USD">USD — $</option><option value="EUR">EUR — €</option><option value="GBP">GBP — £</option>
        </select></div>
      <div><label className="mb-1 block text-sm font-semibold">Members</label>
        <div className="space-y-2">
          {members.map((member, index) => (
            <div key={index} className="flex gap-2">
              <input className="input" value={member} onChange={(e) => updateMember(index, e.target.value)} placeholder={`Member ${index + 1}`} />
              <button type="button" onClick={() => removeMember(index)} className="rounded-xl border border-zinc-200 p-2.5 text-rose-600 hover:bg-rose-50" aria-label="Remove member"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addMember} className="btn-secondary mt-3"><Plus className="h-4 w-4" />Add member</button>
      </div>
      <button type="submit" disabled={!valid || loading} className="btn-primary w-full">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create trip"}</button>
    </form>
  );
}