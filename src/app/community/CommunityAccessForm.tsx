"use client";

import { useState } from "react";

type Result = {
  status?: string;
  joinHint?: string;
  approvedUntil?: string | null;
  error?: string;
};

export function CommunityAccessForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<Result>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setResult({});

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      telegramUsername: String(formData.get("telegramUsername") ?? ""),
      promoCode: String(formData.get("promoCode") ?? ""),
    };

    try {
      const res = await fetch("/api/community/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as Result;
      if (!res.ok) throw new Error(json.error ?? "Xatolik yuz berdi");
      setResult(json);
      setStatus("done");
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : "Xatolik" });
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="To'liq ism">
        <input name="fullName" required className="input-apple" placeholder="Aziz Karimov" />
      </Field>
      <Field label="Telefon">
        <input name="phone" required className="input-apple" placeholder="+998 90 123 45 67" />
      </Field>
      <Field label="Telegram username">
        <input name="telegramUsername" required className="input-apple" placeholder="username yoki @username" />
      </Field>
      <Field label="Promokod">
        <input name="promoCode" className="input-apple" placeholder="Agar bo'lsa kiriting" />
      </Field>

      {status === "done" ? (
        <div className="rounded-2xl border border-[#006b55]/15 bg-[#eaf4ef] px-4 py-3 text-[13px] leading-relaxed text-[#123f34]">
          <b>{result.status === "approved" ? "Ruxsat berildi." : "So'rov qabul qilindi."}</b>{" "}
          {result.joinHint}
        </div>
      ) : null}

      {status === "error" ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-600">
          {result.error}
        </div>
      ) : null}

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full !py-4">
        {status === "loading" ? "Tekshirilmoqda..." : "Communityga qo'shilish"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-semibold tracking-[0.08em] uppercase text-[#86868b]">
        {label}
      </span>
      {children}
    </label>
  );
}
