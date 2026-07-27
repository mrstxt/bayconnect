"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES } from "@/lib/brand";
import { CategoryIcon } from "@/components/Icon";

export function RegisterForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Record<string, string>>({});

  function collect(form: HTMLFormElement) {
    const next = { ...draft };
    new FormData(form).forEach((value, key) => {
      next[key] = String(value);
    });
    setDraft(next);
    return next;
  }

  function goNext(e: React.MouseEvent<HTMLButtonElement>, nextStep: number) {
    const form = e.currentTarget.form;
    if (!form || !form.reportValidity()) return;
    collect(form);
    setError("");
    setStep(nextStep);
  }

  function goBack(e: React.MouseEvent<HTMLButtonElement>, nextStep: number) {
    const form = e.currentTarget.form;
    if (form) collect(form);
    setError("");
    setStep(nextStep);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const data = collect(form);

    const payload = {
      fullName: data.fullName ?? "",
      category: data.category ?? "",
      city: data.city ?? "",
      country: data.country ?? "Uzbekistan",
      languages: (data.languages ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      pricePerDay: Number(data.pricePerDay ?? 0),
      experienceYears: Number(data.experienceYears ?? 0),
      bio: data.bio ?? "",
      phone: data.phone ?? "",
      email: data.email ?? "",
      tags: (data.tags ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      avatarEmoji: "",
      coverColor: data.coverColor ?? "orange",
    };

    try {
      const res = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? "Xatolik");
      }
      const j = (await res.json()) as { id: number };
      router.push(`/providers/${j.id}`);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Xatolik");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex-1 flex items-center gap-2">
            <div
              className={`h-1.5 flex-1 rounded-full transition ${
                step >= n ? "bg-[#006b55]" : "bg-[#123f34]/10"
              }`}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-[12px] font-semibold text-[#86868b]">
        <span className={step === 1 ? "text-[#123f34]" : ""}>Asosiy</span>
        <span className={step === 2 ? "text-[#123f34]" : ""}>Xizmat</span>
        <span className={step === 3 ? "text-[#123f34]" : ""}>Profil</span>
      </div>

      {step === 1 ? (
        <div className="space-y-4 animate-fade-up">
          <Field label="To'liq ism">
            <input
              name="fullName"
              required
              defaultValue={draft.fullName}
              className="input-apple"
              placeholder="Aziz Karimov"
            />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Telefon">
              <input
                name="phone"
                required
                defaultValue={draft.phone}
                className="input-apple"
                placeholder="+998 90 123 45 67"
              />
            </Field>
            <Field label="Email">
              <input
                name="email"
                type="email"
                required
                defaultValue={draft.email}
                className="input-apple"
                placeholder="you@mail.com"
              />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Shahar">
              <input
                name="city"
                required
                defaultValue={draft.city}
                className="input-apple"
                placeholder="Samarqand"
              />
            </Field>
            <Field label="Davlat">
              <input name="country" defaultValue={draft.country ?? "Uzbekistan"} className="input-apple" />
            </Field>
          </div>
          <div className="pt-2 flex justify-end">
            <button type="button" onClick={(e) => goNext(e, 2)} className="btn-primary !px-6">
              Davom etish
            </button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4 animate-fade-up">
          <Field label="Xizmat turi">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((c) => (
                <label
                  key={c.key}
                  className="cursor-pointer rounded-2xl border border-[#123f34]/[0.08] bg-white/72 p-3 has-[:checked]:border-[#006b55] has-[:checked]:bg-[#eaf4ef] transition"
                >
                  <input
                    type="radio"
                    name="category"
                    value={c.key}
                    required
                    className="sr-only"
                    defaultChecked={(draft.category ?? "guide") === c.key}
                  />
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#006b55] ring-1 ring-[#123f34]/5 shadow-sm">
                    <CategoryIcon category={c.key} size={20} strokeWidth={1.9} />
                  </div>
                  <div className="mt-2 text-[13px] font-semibold text-[#123f34]">{c.label}</div>
                </label>
              ))}
            </div>
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Kunlik narx ($)">
              <input
                name="pricePerDay"
                type="number"
                min="1"
                required
                defaultValue={draft.pricePerDay}
                className="input-apple"
                placeholder="60"
              />
            </Field>
            <Field label="Tajriba (yil)">
              <input
                name="experienceYears"
                type="number"
                min="0"
                defaultValue={draft.experienceYears ?? "0"}
                className="input-apple"
              />
            </Field>
          </div>
          <Field label="Tillar (vergul bilan)">
            <input
              name="languages"
              defaultValue={draft.languages}
              className="input-apple"
              placeholder="O'zbek, English, Russian"
            />
          </Field>
          <Field label="Yo'nalishlar / tag'lar">
            <input
              name="tags"
              defaultValue={draft.tags}
              className="input-apple"
              placeholder="Tarixiy joylar, Muzeylar"
            />
          </Field>
          <div className="pt-2 flex justify-between gap-3">
            <button type="button" onClick={(e) => goBack(e, 1)} className="btn-ghost !px-6">
              Orqaga
            </button>
            <button type="button" onClick={(e) => goNext(e, 3)} className="btn-primary !px-6">
              Davom etish
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4 animate-fade-up">
          <Field label="O'zingiz haqingizda">
            <textarea
              name="bio"
              required
              rows={4}
              defaultValue={draft.bio}
              className="input-apple resize-none"
              placeholder="Qisqacha va jozibali tavsif yozing..."
            />
          </Field>

          <Field label="Profil uslubi">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { value: "orange", label: "Orange", cls: "from-orange-300 to-orange-500" },
                { value: "yellow", label: "Yellow", cls: "from-amber-200 to-yellow-400" },
                { value: "blue", label: "Blue", cls: "from-sky-300 to-blue-500" },
                { value: "dark", label: "Dark", cls: "from-neutral-600 to-neutral-900" },
              ].map((c) => (
                <label
                  key={c.value}
                  className="cursor-pointer overflow-hidden rounded-2xl border border-[#123f34]/[0.08] bg-white has-[:checked]:ring-2 has-[:checked]:ring-[#006b55] has-[:checked]:ring-offset-2"
                >
                  <input
                    type="radio"
                    name="coverColor"
                    value={c.value}
                    defaultChecked={(draft.coverColor ?? "orange") === c.value}
                    className="sr-only"
                  />
                  <div className={`h-14 bg-gradient-to-br ${c.cls}`} />
                  <div className="px-2 py-1.5 text-center text-[12px] font-semibold bg-white">
                    {c.label}
                  </div>
                </label>
              ))}
            </div>
          </Field>

          {status === "error" ? (
            <div className="text-[13px] text-red-600 bg-red-50 border border-red-100 rounded-2xl px-3 py-2.5">
              {error}
            </div>
          ) : null}

          <div className="pt-2 flex justify-between gap-3">
            <button type="button" onClick={(e) => goBack(e, 2)} className="btn-ghost !px-6">
              Orqaga
            </button>
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary !px-6 min-w-[160px]"
            >
              {status === "loading" ? "Yaratilmoqda..." : "Profilingizni yaratish"}
            </button>
          </div>
        </div>
      ) : null}
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
