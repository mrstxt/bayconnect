import "dotenv/config";
import { db, getPool } from "../src/db";
import {
  bookings,
  communityAccessRequests,
  promoCodes,
  providers,
  reviews,
  posts,
  subscriptionPlans,
  subscriptions,
  telegramVerifications,
} from "../src/db/schema";

/**
 * Demo ma'lumot to'ldiruvchi skript.
 *
 * DIQQAT: bu skript providers / reviews / posts / bookings jadvallarini
 * TOZALAB, qaytadan to'ldiradi. Production bazada ishlatmang!
 * Himoya sifatida NODE_ENV=production bo'lsa ishga tushmaydi
 * (majburan kerak bo'lsa: ALLOW_PROD_SEED=1).
 */
async function main() {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_PROD_SEED !== "1") {
    throw new Error(
      "Production muhitida seed bloklandi. Haqiqatan kerak bo'lsa ALLOW_PROD_SEED=1 qo'ying.",
    );
  }

  console.log("Eski demo ma'lumotlar tozalanmoqda...");
  // Tartib muhim: foreign key bog'liqligi bo'lgan jadvallar avval o'chadi.
  await db.delete(bookings);
  await db.delete(communityAccessRequests);
  await db.delete(subscriptions);
  await db.delete(telegramVerifications);
  await db.delete(promoCodes);
  await db.delete(subscriptionPlans);
  await db.delete(reviews);
  await db.delete(providers);
  await db.delete(posts);

  await db.insert(subscriptionPlans).values([
    {
      key: "start",
      audience: "specialist",
      title: "Start",
      priceMonthly: 99_000,
      features: ["Katalogda profil", "Telefon va Telegram kontakt", "BayCommunity kirish"],
    },
    {
      key: "pro",
      audience: "specialist",
      title: "Pro",
      priceMonthly: 199_000,
      features: ["Yuqoriroq ko'rinish", "Buyurtma bildirishnomasi", "Statistika", "BayCommunity kirish"],
    },
    {
      key: "premium",
      audience: "specialist",
      title: "Premium",
      priceMonthly: 399_000,
      features: ["Top joylashuv", "Verified badge", "Promo postlar", "Ustuvor support", "BayCommunity kirish"],
    },
    {
      key: "baycommunity",
      audience: "community",
      title: "BayCommunity",
      priceMonthly: 49_000,
      features: ["Yopiq community guruh", "Hamkorlar va imkoniyatlar", "E'lonlar va yangiliklar", "Networking"],
    },
  ]);

  await db.insert(promoCodes).values([
    { code: "BAY1OY", audience: "all", freeMonths: 1, maxUses: 100 },
    { code: "BAY3OY", audience: "all", freeMonths: 3, maxUses: 50 },
  ]);

  // ===== PROVIDERS =====
  const inserted = await db
    .insert(providers)
    .values([
      // GIDLAR
      {
        fullName: "Aziz Karimov",
        category: "guide",
        city: "Samarqand",
        languages: ["O'zbek", "English", "Russian"],
        pricePerDay: 60,
        experienceYears: 8,
        bio: "Registon, Shohi Zinda va Bibi Xonim bo'yicha professional gid. Tarixiy ma'lumotlarni jonli tarzda yetkazib beraman.",
        phone: "+998 90 123 45 67",
        email: "aziz.guide@bayconnect.uz",
        avatarEmoji: "🕌",
        coverColor: "orange",
        tags: ["Tarixiy joylar", "Muzeylar", "Piyoda"],
        rating: "4.90",
        reviewsCount: 42,
        verified: true,
      },
      {
        fullName: "Dilnoza Rahimova",
        category: "guide",
        city: "Buxoro",
        languages: ["O'zbek", "English", "French"],
        pricePerDay: 55,
        experienceYears: 6,
        bio: "Buxoroning eski shahar qismi va hunarmandchilik ustaxonalari bo'yicha yakka va guruh ekskursiyalari.",
        phone: "+998 91 222 33 44",
        email: "dilnoza@bayconnect.uz",
        avatarEmoji: "🌸",
        coverColor: "yellow",
        tags: ["Hunarmandchilik", "Madaniyat"],
        rating: "4.80",
        reviewsCount: 31,
        verified: true,
      },
      {
        fullName: "Rustam Tog'ayev",
        category: "guide",
        city: "Chimyon",
        languages: ["O'zbek", "Russian"],
        pricePerDay: 75,
        experienceYears: 11,
        bio: "Tog'li hududlar bo'yicha treking va ekstremal turizm gidi. Chimyon, Beldersoy, Amirsoy.",
        phone: "+998 99 777 66 55",
        email: "rustam.mountain@bayconnect.uz",
        avatarEmoji: "🏔️",
        coverColor: "dark",
        tags: ["Treking", "Tog'lar"],
        rating: "4.92",
        reviewsCount: 66,
        verified: true,
      },

      // TARJIMONLAR
      {
        fullName: "Bekzod Alimov",
        category: "translator",
        city: "Toshkent",
        languages: ["O'zbek", "English", "German", "Turkish"],
        pricePerDay: 90,
        experienceYears: 12,
        bio: "Ishbilarmonlik uchrashuvlari va turistik ekskursiyalar bo'yicha sinxron tarjimon.",
        phone: "+998 97 444 55 66",
        email: "bekzod.translate@bayconnect.uz",
        avatarEmoji: "🗣️",
        coverColor: "dark",
        tags: ["Sinxron", "Biznes"],
        rating: "4.85",
        reviewsCount: 37,
        verified: true,
      },
      {
        fullName: "Zarina Yusupova",
        category: "translator",
        city: "Samarqand",
        languages: ["O'zbek", "English", "Arabic"],
        pricePerDay: 70,
        experienceYears: 5,
        bio: "Arab va ingliz tillari bo'yicha ekskursiya tarjimoni. Sayyohlar uchun qulay.",
        phone: "+998 93 111 09 09",
        email: "zarina.t@bayconnect.uz",
        avatarEmoji: "🌸",
        coverColor: "orange",
        tags: ["Arab", "Ekskursiya"],
        rating: "4.75",
        reviewsCount: 21,
        verified: true,
      },

      // FOTOGRAFLAR
      {
        fullName: "Malika Xasanova",
        category: "photographer",
        city: "Toshkent",
        languages: ["O'zbek", "English"],
        pricePerDay: 120,
        experienceYears: 7,
        bio: "Sayohat fotografi. Sizning sayohatingizni professional kadrlarda saqlab qolamiz.",
        phone: "+998 90 999 88 77",
        email: "malika.photo@bayconnect.uz",
        avatarEmoji: "📸",
        coverColor: "orange",
        tags: ["Portret", "Landshaft"],
        rating: "5.00",
        reviewsCount: 22,
        verified: true,
      },
      {
        fullName: "Otabek Ismoilov",
        category: "photographer",
        city: "Xiva",
        languages: ["O'zbek", "Russian", "English"],
        pricePerDay: 100,
        experienceYears: 6,
        bio: "Xiva Ichan-Qal'a fonida go'zal sayohat suratlari va videolar.",
        phone: "+998 94 200 30 40",
        email: "otabek.photo@bayconnect.uz",
        avatarEmoji: "🎞️",
        coverColor: "yellow",
        tags: ["Video", "Drone"],
        rating: "4.88",
        reviewsCount: 18,
        verified: false,
      },

      // TUR AGENTLAR
      {
        fullName: "Nodira Travel",
        category: "tour_agent",
        city: "Toshkent",
        languages: ["O'zbek", "Russian", "English"],
        pricePerDay: 200,
        experienceYears: 9,
        bio: "Kompleks tur paketlari: viza, aviabilet, mehmonxona va ekskursiyalar bir joyda.",
        phone: "+998 71 200 30 40",
        email: "info@nodiratravel.uz",
        avatarEmoji: "✈️",
        coverColor: "blue",
        tags: ["Paket", "Viza"],
        rating: "4.75",
        reviewsCount: 210,
        verified: true,
      },
      {
        fullName: "Silk Road Agency",
        category: "tour_agent",
        city: "Samarqand",
        languages: ["English", "Russian", "German"],
        pricePerDay: 250,
        experienceYears: 15,
        bio: "Ipak Yo'li bo'ylab klassik va premium tur paketlar. Xalqaro sayyohlar uchun.",
        phone: "+998 66 233 44 55",
        email: "hello@silkroad.uz",
        avatarEmoji: "🌍",
        coverColor: "blue",
        tags: ["Premium", "Xalqaro"],
        rating: "4.92",
        reviewsCount: 340,
        verified: true,
      },

      // TRANSFER
      {
        fullName: "Sardor Yo'ldoshev",
        category: "transfer",
        subCategory: "airport",
        city: "Toshkent",
        languages: ["O'zbek", "Russian", "English"],
        pricePerDay: 80,
        experienceYears: 10,
        capacity: 4,
        bio: "Aeroport transferi, shaharlararo qulay yo'lovchi tashish. Yangi Cobalt, Gentra.",
        phone: "+998 93 555 66 77",
        email: "sardor.transfer@bayconnect.uz",
        avatarEmoji: "🚗",
        coverColor: "blue",
        tags: ["Aeroport", "24/7"],
        rating: "4.95",
        reviewsCount: 128,
        verified: true,
      },
      {
        fullName: "Jamshid Toshev",
        category: "transfer",
        subCategory: "minivan",
        city: "Samarqand",
        languages: ["O'zbek", "Russian"],
        pricePerDay: 70,
        experienceYears: 5,
        capacity: 7,
        bio: "Samarqand — Buxoro — Xiva yo'nalishlari bo'yicha komfort minivan xizmati.",
        phone: "+998 94 111 22 33",
        email: "jamshid.transfer@bayconnect.uz",
        avatarEmoji: "🚐",
        coverColor: "blue",
        tags: ["Minivan", "Guruh"],
        rating: "4.70",
        reviewsCount: 54,
        verified: false,
      },
      {
        fullName: "Umid Nazarov",
        category: "transfer",
        subCategory: "sedan",
        city: "Buxoro",
        languages: ["O'zbek", "English"],
        pricePerDay: 65,
        experienceYears: 4,
        capacity: 4,
        bio: "Buxoro shahri bo'ylab va yaqin viloyatlarga xavfsiz sedan xizmati.",
        phone: "+998 95 321 21 21",
        email: "umid.taxi@bayconnect.uz",
        avatarEmoji: "🚕",
        coverColor: "orange",
        tags: ["Shahar ichi", "Sedan"],
        rating: "4.60",
        reviewsCount: 19,
        verified: false,
      },
      {
        fullName: "Golden Bus Tours",
        category: "transfer",
        subCategory: "bus",
        city: "Toshkent",
        languages: ["O'zbek", "Russian", "English"],
        pricePerDay: 250,
        experienceYears: 12,
        capacity: 45,
        bio: "45 o'rinlik komfort avtobuslar. Kompaniya va katta guruhlar uchun.",
        phone: "+998 71 288 77 66",
        email: "info@goldenbus.uz",
        avatarEmoji: "🚌",
        coverColor: "yellow",
        tags: ["Katta guruh", "Konditsioner"],
        rating: "4.80",
        reviewsCount: 88,
        verified: true,
      },
      {
        fullName: "Sanjar Ekspeditsiya",
        category: "transfer",
        subCategory: "suv",
        city: "Chimyon",
        languages: ["O'zbek", "Russian"],
        pricePerDay: 130,
        experienceYears: 8,
        capacity: 5,
        bio: "Tog' yo'llari va Orolqumga yo'ltanlamas SUV bilan ekspeditsiya.",
        phone: "+998 90 777 22 22",
        email: "sanjar.suv@bayconnect.uz",
        avatarEmoji: "🚙",
        coverColor: "dark",
        tags: ["Tog'", "Ekspeditsiya"],
        rating: "4.85",
        reviewsCount: 42,
        verified: true,
      },

      // MEHMONXONALAR
      {
        fullName: "Xiva Palace Hotel",
        category: "hotel",
        city: "Xiva",
        languages: ["O'zbek", "English", "Russian"],
        pricePerDay: 45,
        experienceYears: 15,
        bio: "Ichan-Qal'aning ichida joylashgan an'anaviy uslubdagi butik mehmonxona. Nonushta narxga kiritilgan.",
        phone: "+998 62 375 12 34",
        email: "hello@xivapalace.uz",
        avatarEmoji: "🏨",
        coverColor: "yellow",
        tags: ["Butik", "Ichan-Qal'a"],
        rating: "4.65",
        reviewsCount: 89,
        verified: true,
      },
      {
        fullName: "Registan Grand",
        category: "hotel",
        city: "Samarqand",
        languages: ["O'zbek", "English", "Russian"],
        pricePerDay: 85,
        experienceYears: 20,
        bio: "Registondan 5 daqiqa piyoda. Zamonaviy 4* mehmonxona.",
        phone: "+998 66 233 88 99",
        email: "info@registangrand.uz",
        avatarEmoji: "🏛️",
        coverColor: "orange",
        tags: ["4 yulduz", "Markazda"],
        rating: "4.72",
        reviewsCount: 156,
        verified: true,
      },
      {
        fullName: "Bukhara Boutique",
        category: "hotel",
        city: "Buxoro",
        languages: ["O'zbek", "English"],
        pricePerDay: 55,
        experienceYears: 10,
        bio: "Lyabi Hovuz yonidagi qulay butik mehmonxona. Milliy uslubda.",
        phone: "+998 65 224 55 66",
        email: "stay@bukharaboutique.uz",
        avatarEmoji: "🏨",
        coverColor: "yellow",
        tags: ["Butik", "Milliy uslub"],
        rating: "4.68",
        reviewsCount: 72,
        verified: true,
      },
    ])
    .returning({ id: providers.id, name: providers.fullName });

  // Sharhlar
  const aziz = inserted.find((p) => p.name === "Aziz Karimov");
  const sardor = inserted.find((p) => p.name === "Sardor Yo'ldoshev");
  const malika = inserted.find((p) => p.name === "Malika Xasanova");
  const silk = inserted.find((p) => p.name === "Silk Road Agency");

  if (aziz) {
    await db.insert(reviews).values([
      { providerId: aziz.id, authorName: "John (UK)", rating: 5, comment: "Amazing knowledge of Samarkand history!" },
      { providerId: aziz.id, authorName: "Aigul (KZ)", rating: 5, comment: "Очень интересный гид, всё показал." },
    ]);
  }
  if (sardor) {
    await db.insert(reviews).values([
      { providerId: sardor.id, authorName: "Ali (TR)", rating: 5, comment: "Vaqtida keldi, mashina toza." },
    ]);
  }
  if (malika) {
    await db.insert(reviews).values([
      { providerId: malika.id, authorName: "Sophie (FR)", rating: 5, comment: "Best photos of my trip!" },
    ]);
  }
  if (silk) {
    await db.insert(reviews).values([
      { providerId: silk.id, authorName: "Hans (DE)", rating: 5, comment: "Perfect Silk Road organization." },
      { providerId: silk.id, authorName: "Yuki (JP)", rating: 5, comment: "素晴らしいツアー！" },
    ]);
  }

  // ===== POSTS =====
  await db.insert(posts).values([
    {
      title: "Samarqandda 48 soat: nima ko'rish kerak",
      slug: "samarqandda-48-soat",
      excerpt: "Ikki kun ichida Registondan Shohi Zindagacha — batafsil marshrut.",
      body: "Samarqand — Markaziy Osiyoning eng go'zal shaharlaridan biri. Agar sizda faqat 48 soat bo'lsa, quyidagi joylarni albatta ko'ring. Birinchi kun: Registon, Gur-Amir, Bibi Xonim masjidi. Ikkinchi kun: Shohi Zinda, Ulug'bek rasadxonasi, Siyob bozori.",
      emoji: "🕌",
      coverColor: "orange",
      category: "guide",
      readMinutes: 5,
    },
    {
      title: "O'zbekistonda transport: qanday harakatlanish qulay",
      slug: "ozbekistonda-transport",
      excerpt: "Poyezd, taxi, minivan yoki avtobus — qaysi biri qachon mos keladi?",
      body: "O'zbekiston bo'ylab sayohat qilishning bir necha usullari mavjud. Afrosiyob poyezdi Toshkent-Samarqand-Buxoro yo'nalishida eng tez va qulay. Uzoq masofalarga minivan yoki xususiy transfer ma'qul.",
      emoji: "🚗",
      coverColor: "blue",
      category: "tips",
      readMinutes: 4,
    },
    {
      title: "Buxoroning eng yaxshi 7 taomi",
      slug: "buxoro-taomlari",
      excerpt: "Sho'rvadan boshlab shakarob taomlarigacha — Buxoro milliy oshxonasi.",
      body: "Buxoroga borsangiz albatta tatib ko'ring: 1) Buxoro palovi, 2) Yaxna sho'rva, 3) Tandir kabob, 4) Norin, 5) Halim, 6) Bagat, 7) Chak-chak.",
      emoji: "🍲",
      coverColor: "yellow",
      category: "destination",
      readMinutes: 6,
    },
    {
      title: "Xiva: shaharning tunda uyg'onishi",
      slug: "xiva-tunda",
      excerpt: "Ichan-Qal'a tunda chiroqlar bilan qanday ko'rinadi — fotografga sayohat.",
      body: "Xivaning tunda ko'rinishi ajoyib. Kalta Minor, Juma masjidi va boshqa yodgorliklar tunda o'zgacha go'zal. Fotograflar uchun eng qulay vaqt — quyosh botganidan keyingi 30 daqiqa.",
      emoji: "🌙",
      coverColor: "dark",
      category: "story",
      readMinutes: 4,
    },
    {
      title: "Gid tanlashda 5 ta muhim maslahat",
      slug: "gid-tanlash-maslahati",
      excerpt: "To'g'ri gid — sayohat muvaffaqiyati. Nimalarga e'tibor berish kerak?",
      body: "1) Reyting va sharhlarni tekshiring. 2) Tillarni bilishga e'tibor bering. 3) Tajribasi bo'yicha savol bering. 4) Narxlarni oldindan aniqlab oling. 5) Bron qilishdan oldin qisqacha bog'laning.",
      emoji: "💡",
      coverColor: "orange",
      category: "tips",
      readMinutes: 3,
    },
  ]);

  console.log(`✓ Seeded ${inserted.length} providers va blog postlari`);
}

main()
  .then(async () => {
    // Pool'ni toza yopamiz — process.exit(0) yozuvni yarim yo'lda uzib qo'yishi mumkin.
    await getPool().end();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("Seed xatosi:", e);
    await getPool().end().catch(() => {});
    process.exit(1);
  });
