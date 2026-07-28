# bayConnect — Landing Page va Umumiy Stilistika Bo'yicha G'oyalar

Sana: 2026-07-28 · Loyiha: `mrstxt/bayconnect@main`

Hozirgi holat: dizayn allaqachon toza, "Apple-uslubiy" (yumaloq burchaklar, blur, sekin animatsiyalar, kam rangli krem fon). Brand palitra: coral `#FF6B4A`, yashil `#006B55`, sariq `#FFC400`, ko'k `#0717B8`, ink `#123F34`. Quyidagi g'oyalar shu poydevorni saqlab, uni **keyingi bosqichga** olib chiqadi.

G'oyalar 3 guruhga bo'lingan:
- **A** — Landing page (bosh sahifa) kontenti va tuzilishi
- **B** — Umumiy stilistika / dizayn tizimi
- **C** — UX mikro-detallar, animatsiya, a11y, tezlik

Har bir g'oya da **[S]** (1 kechadan kam), **[M]** (1–2 kun), **[L]** (hafta-ish) belgisi bilan.

---

## A. Landing page g'oyalari

### A1. Hero'dagi "soxta qidiruv"ni haqiqiy qidiruvga aylantirish **[S]** — eng muhim
`src/app/page.tsx` dagi `hero-command-panel` ichida `<span>Qidiruv</span>` bor — u hech narsa qilmaydi. Foydalanuvchi bosadi, hech narsa bo'lmaydi → ishonch pasayadi.

Yechim: `<form action="/experts" method="get">` + `<input name="q">`. `/experts` sahifasi `q` parametrini qabul qiladi (flexible `ilike` query queries.ts'da bor — tekshirish kerak). Bu eine keiki ichida tugadi, lekin konversiyani eng ko'p oshiradigan o'zgarish.

```
<form action="/experts" className="hero-command-input ...">
  <SearchIcon ... />
  <input name="q" placeholder="Gid, shahar yoki xizmat qidiring…" className="w-full bg-transparent outline-none" />
  <button type="submit" className="btn-primary !py-2.5">Topish</button>
</form>
```

### A2. Hero'ga real vizual qo'shish **[M]**
Hozir hero — faqat matn + abstrakt dekor. Sayohat mahsulotida **birinchi ekranda Registon yoki Ichan-Qal'a** bo'lmasligi — katta yo'qotish. Variantlar:
- **A2.1 (tavsiya):** Hero matnining o'ng/chap yonida 3–4 ta foto-plitkadon "collage" (Registon, Xiva minorasi, tog' yo'li, Buxoro gumbazlari). Har biri sutunli parallax (`transform: translateY` scrollga bog'langan, `requestAnimationFrame` + `will-change`). Rasm: Unsplash/Pexels'dan litsenziya toza yoki o'z fotolaringiz, `next/image` + `priority` bilan.
- **A2.2:** Hero orqa foniga juda past opasiteli (0.15–0.25) keng panoramik rasm, ustiga krem-gradient overlay — hozirgi `identity-hero`ga faqat 1-2 CSS qatori qo'shiladi.
- **A2.3 (kuchli, lekin og'ir):** 8–10 soniyalik hero video-loop (Samarqand dron kadri). Faqat CDN + poster rasm + `muted autoplay playsinline`. Mobilga rasm fallback **shart**.

### A3. Ishonch qatlami — "social proof" blok **[S]**
Hero tugmalaridan keyin hali bo'sh joy bor. "Uch qadam"dan oldin, testimonial qo'shing:
- `reviews` jadvalidan `rating=5` 3 ta sharhni olib, kartochka-karusel qilish (`overflow-x-auto snap-x` — kutubxonasiz).
- Yoki hali reviews kam bo'lsa: "Oxirgi 7 kunda N ta zayavka yuborildi" counteri + logotip strip ("Partnership: bayTrip", keyinchalik O'zbekturizm, Mehmonxona assotsiatsiyasi logotiplari).

### A4. Shaharlar bo'limi — foto-kartalar **[M]**
Hozir faqat marquee'da shahar nomlari chiziqli oqib turibdi (chiroyli, lekin klicklar oz). Marquee'dan keyin alohida section:
```
Samarqand [foto]  Buxoro [foto]  Xiva [foto]  Toshkent [foto]
     ↓ /experts?city=Samarqand  ...
```
Har bir karta: 3:4 foto, pastida shahar nomi + "12 mutaxassis" counti (`getProviderStats()`ga city-groupBy qo'shish kerak — 1 query). Bu marketplace'lar uchun eng yuqori CTR'li bloklardan.

### A5. Telegram bot CTA'sini alohida section qilish **[S]**
Mutaxassis CTA (`dark-panel`) faqat web registratsiyaga (`/register`) olib boradi, lekin loyihaning eng kuchli tomoni — **bot orqali 2 daqiqada registratsiya + zayavkalar to'g'ri botga keladi**. Buni soting:
- CTA'ga ikkinchi tugma: "Telegram bot orqali qo'shilish → @BayConnectBot" (`https://t.me/...`).
- Yana yaxshisi: CTA section ichida mini-chat mockup (telefon ramkada bot bilan 3 xabarlik animatsiya: `/start` → "Telefon yuborish" → "✅ Profil e'lon qilindi"). CSS-only typewriter effekti. Bu marketing nuqtai nazaridan kumush o'q.

### A6. Landing'ga blog preview **[S]**
"Sayohat gidining Samarqand bo'yicha maslahatlari" kabi 3 ta so'nggi post kartasi. `posts` jadvali va `/blog` allaqachon bor — bosh sahifada `getRecentPosts(3)` chiqarish SEO ichki-linklash uchun ham foydali.

### A7. FAQ accordion **[S]**
"Bron qilish pullikmi?", "Mutaxassislar qanday tekshiriladi?", "To'lov qanday?" kabi 5–6 ta savol. `<details>/<summary>` bilan — JS kerak emas. +  Schema.org `FAQPage` JSON-LD — Google'da rich snippet ko'rinadi.

### A8. Footer'ni boyitish **[S]**
Hozir minimal footer. Qo'shing: shaharlar linkli ustuni (SEO uchun har bir shahar katalogiga link: `/experts?city=...`), Telegram kanal/bot linklari, "Bizning haqqimizda" 1 qator, App emasligi hokazo. Marketplace saytlar uchun keng footer — ichki link massasi.

### A9. Numbers/Stats animatsiyasi **[S]**
`StatCard` (`12+ Mutaxassis` kabi) — qiymatlar viewport'ga kirganda 0'dan joriygacha sanalib chiqsa (`IntersectionObserver` + 600 ms count-up) — obyektiv ko'rsatkich vizual "jonsiz" ko'rinishdan chiqadi.

---

## B. Umumiy stilistika / dizayn tizimi

### B1. Rang tokenlarini markazlashtirish **[M]** — arxitektura jihatdan eng muhim
Hozir `#006b55`, `#123f34`, `#ff6b4a` hex'lari `page.tsx`, `Header`, `Footer`, `globals.css` bo'ylab **hardcoded** (~100+ joyda) tarqalgan. Bir kun kelib "yangi-yashil"ga o'tganda hammasini qidirish kerak bo'ladi.

Tailwind v4'da bu tabiiy:
```css
/* globals.css */
@theme {
  --color-brand: #006B55;
  --color-brand-deep: #123F34;
  --color-coral: #FF6B4A;
  --color-gold: #F3C85A;
  --color-cream: #FAF5EE;
}
```
Keyin kodda `bg-brand text-brand-deep` kabi semantik ishlatiladi. Refactoring 1–2 soat, foydasi doimiy.

### B2. Tipografiya — o'z system stack'dan ko'tarilish **[S]**
`--font-sans: "SF Pro Display", ... "Inter"...` — Mac/iOS'da zo'r (SF Pro), Windows/Android'da Segoe UI yig'iladi — sayt qurilmadan-qurilmaga turlicha ko'rinadi. Yechim:
- **B2.1 (tavsiya):** `next/font/google` bilan **Manrope** (Latin + Kirill — UZ/RU/EN uchun a'lo, `.otf/` woff2, ~60KB). Yoki **Inter** (klassika) yoki **Unbounded** (sarlavhalarga dramatik xarakter).
- Sarlavha/Matn ierarxiyasi: 2 shrift — display (sarlavha: Unbounded yoki Laswer) + body (Manrope/Inter). Hozir bitta stack, o'tkir kontrast yo'q.
- `display: swap` + `preload` avtomatik next/font'dan.

### B3. Emoji-avatarlardan o'tish **[M]**
Provider kartochkalarida `avatarEmoji` (🕌✈️🏨) + gradient — bu MVP ko'rinishini beradi. Variantlar:
- **B3.1:** Initsial avatari (ismdan 2 harf) + deterministik gradient (id'dan hash) — darhol "professional" ko'rinadi, kod 20 qator.
- **B3.2 (keyingi bosqich):** Haqiqiy foto yuklash (Vercel Blob) — marketplace'da ishonch uchun foto SFIDA. Schema'da `avatarUrl` ustuni kerak bo'ladi.

### B4. Dark mode **[L] — lekin arziydi**
`colorScheme: "light"` qotirilgan. Tailwind v4'da `@custom-variant dark` + `class="dark"` strategiyasi bilan:
- B1'degi token refactordan keyin har bir token uchun `--color-brand-dark` jufti.
- `bc_theme` cookie (locale cookie'ga o'xshab) — SSR flicker'siz.
Sayohat auditoriyasi kechqurun ko'p browser qiladi — dark mode konversiyani oshiradi.

### B5. Animatsiyalarni yagona tizimga solish **[S]**
Hozir `animate-fade-up`, `animate-marquee`, `animate-pulse-dot`, `baytrip-orbit` har xil tezlik/timing'da. Birlashtiring:
- Barcha entrance'lar: `duration-500`, `cubic-bezier(0.22,1,0.36,1)` (tailwind's default "out-expo"), stagger `@keyframes` — hozirgi `delay-2/3/4/5` bilan mos.
- **Majburiy:** `@media (prefers-reduced-motion: reduce)` ichida barcha animate-*'larni o'chirish (globals.css'da tekshiring — bo'lmasa qo'shing, a11y talab).

### B6. Karta/Tile vizual ierarxiyasi **[S]**
Har xil card stillar bor: `surface-apple-strong`, `quick-access-card`, `stat-card`, `process-card`, `category-card`, `transport-card`, `service-card`, `baytrip-service-card` — 8 xil! 3 taga keltiring:
- **Surface** (content wrap — oq, ring, subtle shadow)
- **CardInteractive** (hover: lift + ring kuchayishi — barcha clickablenlar bir xil harakat qilsin)
- **PanelDark** (CTA uchun)
Bu "dizayn sistemsizlik shovqinini" yo'qotadi.

### B7. Brend "xarakter" elementi **[M]**
Hozirgi dizayn to'g'ri, lekin "O'zbekiston" identiteti kam: faqat ranglar (coral/yashil) gapiradi. Qo'shish mumkin:
- **Naqsh (pattern):** Zanjira/Atlas naqshidan SVG-pattern dekorativ fon sifatida (opacity 0.04–0.06) hero va dark-panel'larda. `baytrip-grid`'ga o'xshagan texnika, lekin o'zbek geometrik naqshi. Bu saytga "joy" (place) hissini beradi.
- Sardoba minorasi/Registon silueti footer'da one-line SVG drawing.
- **Ehtiyotkorona:** naqsh juda ko'zga tashlansa eskilik bo'ladi — faqat accent joylarda.

### B8. Rang balansi **[S]**
Coral `#FF6B4A` hozir "asosiy raketa" rangi, lekin saytda yashil hukmron. Qoida: **60-30-10** — krem (asosiy) / yashil (brand) / coral (faqat CTA, narx, "yangi" badge kabi 5–10% joylarda). Hozir hero badge, checkmark'lar aralash — kichik audit qilib coral'ni faqat "muhim click" elementlarga qoldiring.

---

## C. UX mikro-detallar, a11y, tezlik

| # | G'oya | Effort | Izoh |
| --- | --- | --- | --- |
| C1 | Sticky header'da progress yoki "mini-search" | [S] | 300px sgrollgandan keyin header'ga ixcham qidiruv tugmasi chiqadi |
| C2 | Focus-visible ringlarini yagona rangga keltirish | [S] | `outline: 2px solid var(--color-coral)`, a11y uchun shart |
| C3 | Kontrast audit: `#7b827f` matni krem fonda — 4.5:1 yetmasligi mumkin | [S] | Sekundar matnni `#5f6c66`ga to'g'rilang |
| C4 | Katalog skeleton'lar — `loading.tsx` bor, lekin card-grid bilan bir xil grid o'lchovga keltirish | [S] | Layout shift yo'qoladi |
| C5 | `next/font` (B2 bilan birga) — font `swap` davrida matn sakrashini Yo'q qiladi | [S] | |
| C6 | Marquee'ni CSS `content-visibility`/`contain` bilan izolyatsiya qilish | [S] | Infinite animation scroll-perf'ni yemasin |
| C7 | Hover-less qurilmalarda (touch) `hover-lift` o'rniga `:active` press effekti | [S] | `active:scale-[0.98]` |
| C8 | i18n matnlarini `src/lib/i18n/{uz,ru,en}.ts` lug'atlarga ko'chirish | [M] | Hozir ternary'lar har fayl ichida — 4-til qo'shilsa jahannam |
| C9 | OG-rasm (opengraph-image.tsx) allaqachon generatsiya qilinadi — share test @TwitterCard validator'da ko'ring | [S] | |
| C10 | Katalog filtrlarini URL'ga yozish (bormi?) — browser "orqaga"da filtr saqlanishi | [S] | `searchParams` bilan sinxron — UX asosiy |

---

## Tavsiya etilgan implementatsiya tartibi (2 haftalik yo'l xaritasi)

**1-hafta (arzon + samarali):**
1. A1 — Hero real qidiruv
2. A5 — Telegram bot CTA + mini-chat mockup
3. B2 — Manrope/Unbounded shriftlar
4. A3 + A9 — social proof + stat count-up
5. C2, C3, C5 — a11y audit

**2-hafta (tizimli):**
6. B1 — @theme token'lar + butun saytni semantik ranglarga ko'chirish
7. A2.1 — Hero foto-collage (ro'yxatdan o'tgan fotograf-providerlaringizdan bepul olsangiz ham bo'ladi — barter: "saytda akkreditiv")
8. A4 — Shaharlar foto-kartalri
9. A7 — FAQ + JSON-LD
10. B3.1 — Initsial avatarlar

**Keyingi bosqich:** B4 dark mode, A2.3 hero video, B3.2 foto yuklash, C8 i18n lug'atlar.

Ushbu o'zgarishlar bir-biriga zid kelmaydi va har biri alohida deploy qilinishi mumkin.
