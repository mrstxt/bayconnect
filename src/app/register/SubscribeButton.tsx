"use client";

import { useCallback, useEffect, useState } from "react";

type SubscribeButtonProps = {
  audience: "specialist" | "community";
  planKey: string;
  label?: string;
  className?: string;
};

type Result = {
  status?: string;
  nextStep?: string;
  communityJoinUrl?: string | null;
  error?: string;
};

type VerifyStart = {
  token?: string;
  botUrl?: string;
  error?: string;
};

type VerifyStatus = {
  status?: string;
  telegramUsername?: string | null;
  error?: string;
};

export function SubscribeButton({
  audience,
  planKey,
  label = "Obuna bo'lish",
  className = "btn-primary w-full !py-3.5 text-[14px]",
}: SubscribeButtonProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<Result>({});
  const [paymentSoon, setPaymentSoon] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const [verifiedUsername, setVerifiedUsername] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "loading" | "pending" | "verified" | "error">("idle");
  const [verifyError, setVerifyError] = useState("");

  async function submit(form: HTMLFormElement, method: "promo" | "payment") {
    if (status === "loading") return;
    if (!verificationToken || !verifiedUsername) {
      setStatus("error");
      setResult({ error: "Avval Telegram profilingizni tasdiqlang" });
      return;
    }
    setStatus("loading");
    setResult({});

    const formData = new FormData(form);
    const payload = {
      audience,
      planKey,
      method,
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      telegramUsername: verifiedUsername,
      telegramVerificationToken: verificationToken,
      promoCode: String(formData.get("promoCode") ?? ""),
    };

    try {
      const res = await fetch("/api/subscriptions/intent", {
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

  async function startTelegramVerification() {
    setVerifyStatus("loading");
    setVerifyError("");
    setVerifiedUsername("");

    try {
      const res = await fetch("/api/telegram/verify/start", { method: "POST" });
      const json = (await res.json().catch(() => ({}))) as VerifyStart;
      if (!res.ok || !json.token || !json.botUrl) {
        throw new Error(json.error ?? "Telegram tasdiqlash ochilmadi");
      }
      setVerificationToken(json.token);
      setVerifyStatus("pending");
      window.open(json.botUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setVerifyStatus("error");
      setVerifyError(err instanceof Error ? err.message : "Xatolik");
    }
  }

  const checkTelegramVerification = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!verificationToken) {
      setVerifyStatus("error");
      setVerifyError("Avval tasdiqlashni boshlang");
      return;
    }

    if (!silent) {
      setVerifyStatus("loading");
      setVerifyError("");
    }

    try {
      const res = await fetch(`/api/telegram/verify/status?token=${encodeURIComponent(verificationToken)}`);
      const json = (await res.json().catch(() => ({}))) as VerifyStatus;
      if (!res.ok) throw new Error(json.error ?? "Tasdiqlash tekshirilmadi");
      if (json.status === "verified" && json.telegramUsername) {
        setVerifiedUsername(json.telegramUsername);
        setVerifyStatus("verified");
      } else if (json.status === "expired") {
        setVerifyStatus("error");
        setVerifyError("Tasdiqlash muddati tugagan. Qayta tasdiqlang.");
      } else {
        setVerifyStatus("pending");
        if (!silent) setVerifyError("Hali tasdiqlanmadi. Botda /start bosib qayting.");
      }
    } catch (err) {
      setVerifyStatus("error");
      setVerifyError(err instanceof Error ? err.message : "Xatolik");
    }
  }, [verificationToken]);

  useEffect(() => {
    if (!open || !verificationToken || verifiedUsername || verifyStatus !== "pending") return;

    const check = () => {
      if (document.visibilityState === "visible") {
        void checkTelegramVerification({ silent: true });
      }
    };

    const interval = window.setInterval(check, 2000);
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", check);
    check();

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, [checkTelegramVerification, open, verificationToken, verifiedUsername, verifyStatus]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/35 px-4 py-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-black/10 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#006b55]">
                  {audience === "specialist" ? "Mutaxassis obunasi" : "Community obunasi"}
                </div>
                <h2 className="mt-2 text-[24px] font-black tracking-tight text-[#123f34]">
                  Obuna bo'lish
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setStatus("idle");
                  setResult({});
                  setPaymentSoon(false);
                  setVerificationToken("");
                  setVerifiedUsername("");
                  setVerifyStatus("idle");
                  setVerifyError("");
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#123f34]/[0.06] text-[20px] text-[#123f34]"
                aria-label="Yopish"
              >
                x
              </button>
            </div>

            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                submit(e.currentTarget, "promo");
              }}
            >
              <Field label="To'liq ism">
                <input name="fullName" required className="input-apple" placeholder="Aziz Karimov" />
              </Field>
              <Field label="Telefon">
                <input name="phone" required className="input-apple" placeholder="+998 90 123 45 67" />
              </Field>
              <div>
                <span className="mb-2 block text-[12px] font-semibold tracking-[0.08em] uppercase text-[#86868b]">
                  Telegram
                </span>
                <div className="rounded-2xl border border-[#123f34]/[0.08] bg-[#f8fbfa] p-3">
                  {verifiedUsername ? (
                    <div className="rounded-xl bg-[#eaf4ef] px-3 py-2 text-[13px] font-semibold text-[#006b55]">
                      Profil tasdiqlandi: @{verifiedUsername}
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={startTelegramVerification}
                          disabled={verifyStatus === "loading"}
                          className="btn-primary !px-4 !py-3 text-[13px]"
                        >
                          {verificationToken ? "Qayta tasdiqlash" : "Telegram orqali tasdiqlash"}
                        </button>
                        {verificationToken ? (
                          <button
                            type="button"
                            onClick={() => checkTelegramVerification()}
                            disabled={verifyStatus === "loading"}
                            className="btn-ghost !px-4 !py-3 text-[13px]"
                          >
                            Tasdiqlashni tekshirish
                          </button>
                        ) : null}
                      </div>
                      {verifyStatus === "pending" && !verifyError ? (
                        <div className="mt-3 rounded-xl bg-[#f4fbf8] px-3 py-2 text-[13px] font-semibold text-[#006b55]">
                          Botda /start bosing. Sayt avtomatik tekshiradi.
                        </div>
                      ) : null}
                    </>
                  )}
                  {verifyError ? (
                    <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[13px] text-red-600">
                      {verifyError}
                    </div>
                  ) : null}
                </div>
              </div>
              <Field label="Promokod">
                <input name="promoCode" className="input-apple" placeholder="Promokod bo'lsa kiriting" />
              </Field>

              {status === "done" ? (
                <>
                  {result.status === "active" ? (
                    <div className="rounded-2xl border border-[#006b55]/15 bg-[#f4fbf8] px-4 py-3 text-[13px] leading-relaxed text-[#123f34]">
                      <b>BayCommunityga kirish arizasi.</b>{" "}
                      Guruhga kirish uchun bot taklif havolasi orqali ariza yuboring. Bot Telegram
                      profilingizni tekshiradi va username mos bo'lsa avtomatik tasdiqlaydi.
                      {result.communityJoinUrl ? (
                        <a
                          href={result.communityJoinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary mt-3 w-full !py-3 text-center text-[13px]"
                        >
                          BayCommunityga ariza yuborish
                        </a>
                      ) : (
                        <div className="mt-3 rounded-xl bg-white px-3 py-2 text-[12px] font-semibold text-[#006b55]">
                          Taklif havolasi sozlanmoqda. Bot admin huquqlari va TELEGRAM_COMMUNITY_CHAT_ID env'ini tekshiring.
                        </div>
                      )}
                    </div>
                  ) : null}
                  <div className="rounded-2xl border border-[#006b55]/15 bg-[#eaf4ef] px-4 py-3 text-[13px] leading-relaxed text-[#123f34]">
                    <b>{result.status === "active" ? "Obuna bo'ldingiz. OK." : "So'rov qabul qilindi."}</b>{" "}
                    {result.nextStep}
                  </div>
                </>
              ) : null}

              {paymentSoon ? (
                <div className="rounded-2xl border border-[#006b55]/15 bg-[#f4fbf8] px-4 py-3 text-[13px] font-semibold text-[#006b55]">
                  To'lov qilish imkoniyati tez kunda ishga tushadi. Hozircha promokod orqali obunani yoqishingiz mumkin.
                </div>
              ) : null}

              {status === "error" ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                  {result.error}
                </div>
              ) : null}

              <div className="grid gap-2 sm:grid-cols-2">
                <button type="submit" disabled={status === "loading"} className="btn-primary !py-3.5 text-[14px]">
                  {status === "loading" ? "Tekshirilmoqda..." : "Promokod bilan yoqish"}
                </button>
                <button
                  type="button"
                  disabled={status === "loading"}
                  onClick={() => {
                    setPaymentSoon(true);
                    setStatus("idle");
                    setResult({});
                  }}
                  className="btn-ghost !py-3.5 text-[14px]"
                >
                  To'lov qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
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
