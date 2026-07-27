"use client";

import { useMemo, useState } from "react";

export function BookingForm({ providerId }: { providerId: number }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [people, setPeople] = useState(1);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);

    const startDate = String(data.get("startDate") ?? "");
    const endDate = String(data.get("endDate") ?? "");
    if (startDate && endDate && endDate < startDate) {
      setStatus("error");
      setError("Tugash sanasi boshlanish sanasidan oldin bo'lishi mumkin emas.");
      return;
    }

    const payload = {
      providerId,
      clientName: String(data.get("clientName") ?? ""),
      clientEmail: String(data.get("clientEmail") ?? ""),
      clientPhone: String(data.get("clientPhone") ?? ""),
      startDate,
      endDate,
      peopleCount: Number(data.get("peopleCount") ?? 1),
      message: String(data.get("message") ?? ""),
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? "Xatolik yuz berdi");
      }
      setStatus("success");
      form.reset();
      setPeople(1);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Xatolik");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-5 rounded-[8px] bg-[#e8f8ef] border border-emerald-200/70 p-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl">
          ✓
        </div>
        <h4 className="mt-4 text-[18px] font-semibold tracking-tight text-emerald-900">
          Zayavka yuborildi
        </h4>
        <p className="mt-2 text-[14px] text-emerald-800/80 leading-relaxed">
          Mutaxassis tez orada siz bilan bog'lanadi. Email va telefoningizni tekshirib turing.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-[13px] font-semibold text-emerald-800 hover:underline underline-offset-4"
        >
          Yana bir zayavka
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-3">
      <input name="clientName" required placeholder="Ismingiz" className="input-apple" />
      <input
        name="clientEmail"
        type="email"
        required
        placeholder="Email"
        className="input-apple"
      />
      <input name="clientPhone" required placeholder="Telefon" className="input-apple" />

      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[#86868b]">
            Boshlanish
          </span>
          <input
            name="startDate"
            type="date"
            required
            min={today}
            className="input-apple"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[#86868b]">
            Tugash
          </span>
          <input name="endDate" type="date" required min={today} className="input-apple" />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[#86868b]">
          Odam soni
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPeople((n) => Math.max(1, n - 1))}
            className="w-10 h-10 rounded-full bg-[#fff7ef] border border-[#006b55]/10 font-semibold hover:bg-[#eaf4ef]"
          >
            −
          </button>
          <input type="hidden" name="peopleCount" value={people} />
          <span className="min-w-8 text-center text-[17px] font-semibold">{people}</span>
          <button
            type="button"
            onClick={() => setPeople((n) => Math.min(50, n + 1))}
            className="w-10 h-10 rounded-full bg-[#fff7ef] border border-[#006b55]/10 font-semibold hover:bg-[#eaf4ef]"
          >
            +
          </button>
        </div>
      </label>

      <textarea
        name="message"
        placeholder="Qo'shimcha xabar (ixtiyoriy)"
        rows={3}
        className="input-apple resize-none"
      />

      {status === "error" ? (
        <div className="text-[13px] text-red-600 bg-red-50 border border-red-100 rounded-[8px] px-3 py-2.5">
          {error}
        </div>
      ) : null}

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full !py-3.5">
        {status === "loading" ? "Yuborilmoqda..." : "Zayavka yuborish"}
      </button>
    </form>
  );
}
