"use client";
import { X } from "lucide-react";
import { useEffect } from "react";
export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose?.();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-lg rounded-t-3xl bg-white p-5 shadow-xl sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100" aria-label="Close modal"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}