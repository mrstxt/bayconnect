# bayConnect — kod tahlili va tuzatishlar hisoboti

Sana: 2026-07-28 · Tekshirilgan versiya: `mrstxt/bayconnect@main`

**Natija:** 35 fayl o'zgartirildi, 5 ta yangi fayl qo'shildi, 1 ta o'chirildi.
`npm run lint`, `npm run typecheck` va `npm run build` — hammasi toza o'tadi.

---

## 🔴 Xavfsizlik (kritik)

### 1. `.env.example` ichida haqiqiy Neon paroli turgan edi

```env
# ESKI — bu GitHub'da ochiq turgan!
DATABASE_URL="postgresql://neondb_owner:npg_0MybFYS8xUJN@ep-summer-base-...neon.tech/bayconnect"
```

Bu **eng jiddiy muammo**. Repozitoriya public bo'lsa, istalgan odam bazangizga to'liq kirish huquqiga ega bo'ladi — ma'lumotlarni o'qishi, o'zgartirishi yoki o'chirishi mumkin.

**Tuzatildi:** `.env.example` da faqat namuna qoldirildi.

> ### ⚠️ Siz hozir bajarishingiz kerak
>
> Fayldan olib tashlash **yetarli emas** — parol git tarixida qoladi.
>
> 1. **Neon panelida parolni darhol almashtiring:**
>    `Dashboard → Project → Roles → neondb_owner → Reset password`
> 2. Yangi parolni Vercel `Settings → Environment Variables` ga yozing.
> 3. Vercel'da **Redeploy** qiling.
> 4. Istasangiz git tarixini ham tozalang:
>    `git filter-repo --path .env.example --invert-paths`

### 2. Telefon raqami umuman tekshirilmasdi

`"asdasd"`, bo'sh satr, HTML kod — hammasi bazaga tushardi.
**Tuzatildi:** `isValidPhone()` — format + raqamlar soni (7–15) tekshiriladi.

### 3. Sana validatsiyasi soxta edi

Sanalar oddiy satr sifatida solishtirilardi:

```ts
if (endDate < startDate)   // "2026-13-45" ham o'tib ketardi
```

**Tuzatildi:** `isValidIsoDate()` haqiqiy kalendar sanasini tekshiradi, o'tgan sanaga bron bloklandi, maksimal muddat 365 kun.

### 4. Rate limiting yo'q edi

Bitta skript soniyasiga minglab zayavka yuborib bazani to'ldirishi mumkin edi.
**Tuzatildi:** bookings 5/daq, register 10/soat, by-ids 60/daq.

### 5. Payload hajmi cheklanmagan edi

10 MB JSON yuborib lambda xotirasini tugatish mumkin edi.
**Tuzatildi:** `readJson()` 32 KB dan kattasini rad etadi.

### 6. LIKE injection orqali bazani sekinlashtirish

Foydalanuvchi qidiruvga `%` yozsa, u SQL joker belgisiga aylanib butun jadvalni skanerlardi.
**Tuzatildi:** `\`, `%`, `_` belgilari ekranlanadi (PGlite'da tasdiqlandi).

### 7. Xavfsizlik sarlavhalari yo'q edi

**Tuzatildi:** `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` qo'shildi, `X-Powered-By` olib tashlandi.

---

## 🟠 Ishlashni sekinlashtirgan xatolar

### 8. Ro'yxatlarda `LIMIT` umuman yo'q edi ⚠️ eng katta muammo

```ts
// ESKI — /experts har ochilganda BARCHA providerlarni tortardi
return db.select().from(providers).where(...).orderBy(...);
```

100 ta yozuvda sezilmaydi. 5 000 ta yozuvda sahifa 10+ soniya ochiladi va Neon trafik limiti tugaydi.

**Tuzatildi:** `LIMIT 12` + `OFFSET`, jami son bitta `count(*) over()` bilan o'sha so'rovda hisoblanadi (ikkinchi `COUNT` so'rovi kerak emas).

### 9. Har bir sahifa `force-dynamic` edi

7 ta sahifada `export const dynamic = "force-dynamic"` — ya'ni **hech qanday kesh yo'q**, har bir tashrifda DB'ga so'rov ketardi.

**Tuzatildi:**

| Sahifa | Edi | Bo'ldi |
|---|---|---|
| `/` | har so'rovda 2 ta query | ISR 5 daq |
| `/experts`, `/transfer`, `/hotels` | har so'rovda query | ISR 2 daq + `unstable_cache` |
| `/blog` | har so'rovda query | ISR 10 daq |
| `/blog/[slug]` | har so'rovda query | **SSG** — build vaqtida HTML |
| `/providers/[id]` | har so'rovda 3 ta query | ISR 5 daq |

### 10. DB'da bironta ham indeks yo'q edi

Har bir filtr butun jadvalni skanerlardi (`Seq Scan`).
**Tuzatildi:** 11 ta indeks qo'shildi (`providers` — 6 ta, `bookings` — 2, `reviews` — 1, `posts` — 2).

### 11. `SELECT *` — keraksiz ustunlar tortilardi

Kartada faqat 14 ta ustun kerak, lekin 20 tasi (`bio`, `languages`, `phone`, `email`, `created_at`...) tortilardi. Blog ro'yxatida esa har bir maqolaning **to'liq `body`** matni.

**Tuzatildi:** aniq ustunlar ro'yxati (`cardColumns`, `postListColumns`).

### 12. Shahar filtri indeksdan foydalana olmasdi

```ts
ilike(providers.city, `%${city}%`)   // ESKI — har doim Seq Scan
```

Shahar aniq ro'yxatdan tanlanadi, `%...%` mantiqan ham keraksiz edi.
**Tuzatildi:** `eq()` — indeksdan foydalanadi.

### 13. Har scroll eventida butun Header qayta render bo'lardi

```ts
const onScroll = () => setScrolled(window.scrollY > 8);   // ESKI
```

Scroll paytida sekundiga o'nlab marta React render — sekin telefonlarda sezilarli "jank".

**Tuzatildi:** `requestAnimationFrame` + to'g'ridan-to'g'ri `classList.toggle()`. React render umuman ishtirok etmaydi. Xuddi shu `ScrollTop` da ham.

### 14. `localStorage` har renderda o'qilardi

`isFavorite()` har chaqirilganda `getItem` + `JSON.parse` — 12 ta kartali sahifada bu 12 ta sinxron disk o'qish (main thread bloklanadi).

**Tuzatildi:** xotirada kesh + `useSyncExternalStore` hook.

### 15. Sevimlilar har o'zgarishda 2 ta event yuborardi

Legacy `bayclub:` eventi ham yuborilardi va Header ikkalasini tinglardi → har bosishda ikki marta `setState`.
**Tuzatildi:** bitta event.

### 16. `/providers` sahifasi ortiqcha render qilardi

`redirect()` chaqiruvchi React sahifa. Bu funksiya ishga tushishini talab qiladi.
**Tuzatildi:** `next.config.ts` da 308 redirect — CDN darajasida, funksiyasiz. Barcha ichki linklar `/experts` ga o'zgartirildi (4 joyda).

### 17. Logo har doim `priority` edi va 5917px yuklanardi

Footer'dagi logo ham "eng muhim" deb belgilangan edi → LCP sekinlashardi. `width={2048}` berilgan, aslida ~138px ko'rsatiladi.
**Tuzatildi:** `priority` faqat header'da, real o'lcham + `sizes`, AVIF/WebP yoqildi.

### 18. Footer'da `new Date()` har renderda

**Tuzatildi:** modul darajasida bir marta.

---

## 🟡 Funksional xatolar

### 19. Register formada tugma abadiy "Yaratilmoqda..." bo'lib qolardi

Xatolik bo'lganda `setStatus("error")` chaqirilardi, lekin muvaffaqiyatli javobda `id` kelmasa hech narsa bo'lmasdi — foydalanuvchi qotib qolgan tugmaga qarab turardi.
**Tuzatildi:** `id` tekshiriladi, xatolar to'g'ri ushlanadi, ikki marta bosish bloklandi.

### 20. `scrollbar-none` klassi mavjud emas edi

`/experts` da ishlatilgan, lekin CSS'da e'lon qilinmagan — ya'ni hech narsa qilmasdi.
**Tuzatildi:** CSS'ga qo'shildi.

### 21. `prose` klasslari ishlamasdi

Blog maqolasida `prose prose-lg` ishlatilgan, lekin `@tailwindcss/typography` plugini o'rnatilmagan.
**Tuzatildi:** o'z stillari bilan almashtirildi (paket qo'shmasdan).

### 22. Dinamik `delay-${i+1}` klassi Tailwind purge'da yo'qolishi mumkin edi

**Tuzatildi:** inline `animationDelay`.

### 23. Blog maqolasida bo'sh paragraflar

`body.split("\n")` bo'sh qatorlarni ham `<p>` ga aylantirardi.
**Tuzatildi:** filtrlanadi.

### 24. Sevimlilar sahifasida race condition

Tez-tez o'zgartirilganda eskirgan javob yangisining ustiga yozilishi mumkin edi.
**Tuzatildi:** `AbortController` + request ID.

### 25. `FavoriteButton` da memory leak

`setTimeout` tozalanmasdi.
**Tuzatildi:** `useEffect` cleanup.

### 26. `parseId` — `Number.isFinite` yetarli emas edi

`"12.9"`, `"1e3"`, `"0x10"` kabi qiymatlar o'tib ketardi.
**Tuzatildi:** `/^\d+$/` regex.

### 27. DB pool `max: 5` — serverless uchun xato

Har bir lambda instansiyasi 5 ta ulanish ochardi. 20 ta parallel instansiya = 100 ta ulanish, Neon bepul tarifda limit ~100.
**Tuzatildi:** prod'da `max: 1`, `allowExitOnIdle`, pool xatolari ushlanadi.

### 28. `db/index.ts` import paytida yiqilardi

`throw new Error("DATABASE_URL is required in")` — modul yuklanishi bilanoq. Xato matni ham chala yozilgan.
**Tuzatildi:** lazy proxy — pool birinchi query'da ochiladi, xato matni tushunarli.

### 29. Build DB'siz yiqilardi

ISR sahifalari build vaqtida prerender qilinadi. Neon uxlab qolgan bo'lsa — **butun deploy yiqiladi**.
**Tuzatildi:** `safe()` o'ram. Muhim detal — xato `unstable_cache` **tashqarisida** ushlanadi, shuning uchun bo'sh natija keshlanmaydi.

### 30. Yangi profil 2 daqiqagacha ko'rinmasdi

Kesh qo'shilgach invalidatsiya kerak bo'ldi.
**Tuzatildi:** `revalidateTag(CACHE_TAGS.providers, "max")`.

> Eslatma: Next.js 16 da `revalidateTag` **ikkita** argument talab qiladi. Bitta argument bilan yozilsa TypeScript build xatosi beradi.

### 31. Seed skripti xavfli edi

Production bazani tozalab yuborishi mumkin edi, `bookings` jadvalini o'chirmasdi (FK xatosi), `process.exit(0)` yozuvni yarim yo'lda uzishi mumkin edi.
**Tuzatildi:** prod himoyasi, to'g'ri o'chirish tartibi, pool toza yopiladi.

### 32. Eski brend qoldiqlari

Seed'da 11 ta `@bayclub.uz` email.
**Tuzatildi:** `@bayconnect.uz`.

---

## 🟢 SEO va accessibility

### 33. SEO deyarli yo'q edi

**Qo'shildi:**

- `metadataBase` — OG rasmlar ishlashi uchun shart
- Har bir sahifaga o'z `title` / `description` / `canonical`
- Profil sahifasiga dinamik metadata + **JSON-LD** (Google rich results)
- `sitemap.xml` va `robots.txt` (avtomatik generatsiya)
- Twitter Card, `viewport`, `themeColor`

### 34. Accessibility muammolari

**Tuzatildi:**

- Skip-link qo'shildi
- `aria-label`, `aria-current`, `aria-expanded`, `aria-pressed`
- Mobil menyu: Escape bilan yopiladi, scroll bloklanadi
- `prefers-reduced-motion` hurmat qilinadi
- Ko'rinmayotgan ScrollTop tugmasi klaviatura uchun ham yashiriladi

### 35. Takrorlangan kod

`makeHref()` uch sahifada nusxalangan, `PanelStat` uch marta.
**Tuzatildi:** `lib/searchParams.ts` va `components/Pagination.tsx`.

---

## Yangi fayllar

| Fayl | Vazifasi |
|---|---|
| `src/lib/searchParams.ts` | Filtr/URL yordamchilari, xavfsiz parsing |
| `src/lib/validation.ts` | Validatsiya + rate limiting |
| `src/lib/useFavorites.ts` | `useSyncExternalStore` hook |
| `src/lib/site.ts` | Kanonik URL aniqlash |
| `src/components/Pagination.tsx` | Sahifalash (server komponent) |
| `src/app/sitemap.ts` | sitemap.xml |
| `src/app/robots.ts` | robots.txt |

---

## Kutilayotgan natija

| Ko'rsatkich | Edi | Bo'ldi |
|---|---|---|
| `/experts` DB so'rovi | har tashrifda, LIMIT'siz | 2 daq keshda, LIMIT 12 |
| 1 000 provider bilan sahifa | butun jadval tortiladi | 12 ta qator |
| Bosh sahifa | har tashrifda 2 query | 5 daq keshda |
| Blog maqolasi | har tashrifda query | statik HTML |
| Scroll paytida render | sekundiga o'nlab | 0 |
| DB indekslari | 0 | 11 |
| Build DB'siz | ❌ yiqiladi | ✅ o'tadi |

Eng katta ta'sir baza o'sgani sayin seziladi: hozirgi demo ma'lumot bilan farq kichik, ammo 1 000+ yozuvda eski kod amalda ishlamay qolardi.

---

## Tekshirilgan

- ✅ `npm run lint` — 0 xato, 0 ogohlantirish
- ✅ `npm run typecheck` — 0 xato
- ✅ `npm run build` — o'tadi (DB bo'lmaganda ham)
- ✅ 10 ta sahifa 200 qaytaradi, `/providers` → 308
- ✅ API validatsiyasi 10 ta stsenariyda sinaldi
- ✅ SQL mantiq PGlite (haqiqiy Postgres) da 13 ta test bilan tasdiqlandi
- ✅ Xavfsizlik sarlavhalari javobda mavjud

---

## Keyingi qadamlar (tavsiya)

1. **Neon parolini almashtiring** — eng birinchi ish.
2. `POST /api/providers` hozir autentifikatsiyasiz — istalgan odam profil qo'sha oladi. Admin tasdiqlash yoki auth qo'shishni o'ylang.
3. Zayavka kelganda email/Telegram xabarnoma (hozir faqat bazaga yoziladi, hech kim ko'rmaydi).
4. Jiddiy yuk kutilsa rate limiting'ni Upstash Redis'ga ko'chiring (hozirgi versiya har bir serverless instansiya uchun alohida).
5. Qidiruv tez-tez ishlatilsa, `ILIKE` o'rniga Postgres full-text search (`tsvector` + GIN indeks).
