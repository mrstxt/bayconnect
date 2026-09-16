/**
 * bayConnect 2.0 — i18n (Internationalization) tizimi
 * UZ / EN / RU qo'llab-quvvatlash
 * Cookie + URL asosida til tanlash
 * Server Component + Client Component uchun ishlatsa bo'ladi
 */

import type { LangCode } from "./brand";

export { type LangCode };
export const DEFAULT_LANG: LangCode = "uz";
export const SUPPORTED_LANG_CODES: LangCode[] = ["uz", "en", "ru"];

/* ==========================================================================
   TARJIMA LUG'ATI
   ========================================================================== */
export type Translations = typeof uz;

const uz = {
  // Nav
  nav: {
    home:         "Bosh sahifa",
    experts:      "Mutaxassislar",
    destinations: "Manzillar",
    experiences:  "Tajribalar",
    transfer:     "Transfer",
    hotels:       "Mehmonxonalar",
    itineraries:  "Marshrutlar",
    visaInfo:     "Viza ma'lumoti",
    blog:         "Blog",
    stats:        "Statistika",
    favorites:    "Sevimlilar",
    register:     "Hamkor bo'lish",
    tourPackages: "Tur paketlar",
    community:    "BayCommunity",
  },

  // Hero
  hero: {
    badge:       "Gidlar, transfer va sayohat xizmatlari bir joyda",
    title:       "O'zbekistonda sayohatni",
    titleAccent: "oson qiladigan",
    titleEnd:    "zamonaviy platforma.",
    subtitle:    "Gid, tarjimon, fotograf, transfer va mehmonxonalarni bir platformada toping. Tekshirilgan profillar, shaffof narxlar.",
    ctaExperts:  "Mutaxassislarni ko'rish",
    ctaTours:    "Tur paketlar",
    searchPlaceholder: "Qidiruv — shahar, ism yoki xizmat...",
    trust1:      "Tekshirilgan profillar",
    trust2:      "Shaffof narxlar",
    trust3:      "Tez zayavka",
  },

  // Sahifalar sarlavhalari
  pages: {
    experts: {
      title:    "Turizm mutaxassislari",
      subtitle: "Gidlar, tarjimonlar, fotograflar va tur agentlari.",
      eyebrow:  "Odamlar",
    },
    destinations: {
      title:    "O'zbekiston shaharlari",
      subtitle: "Registon'dan Ichan-Qal'agacha — eng yaxshi turizm manzillari.",
      eyebrow:  "Manzillar",
    },
    experiences: {
      title:    "Noyob tajribalar",
      subtitle: "Atlas to'qish, non yopish, ot minish — mahalliy hunarmandlar bilan.",
      eyebrow:  "Tajribalar",
    },
    itineraries: {
      title:    "Tayyor marshrutlar",
      subtitle: "Ipak Yo'lidan tog' sarguzashtlarigacha — sizga mos marshrut.",
      eyebrow:  "Marshrutlar",
    },
    visaInfo: {
      title:    "Viza ma'lumotlari",
      subtitle: "O'zbekistonga kirish — e-viza, chegara viza va bepul rejimlar.",
      eyebrow:  "Viza",
    },
    hotels: {
      title:    "Mehmonxonalar",
      subtitle: "Butik mehmonxonalardan zamonaviy 4* mehmonxonalargacha.",
      eyebrow:  "Joylashuv",
    },
    transfer: {
      title:    "Transfer xizmatlari",
      subtitle: "Yengil avtodan avtobusgacha — har qanday guruh uchun.",
      eyebrow:  "Transfer",
    },
  },

  // Umumiy UI
  ui: {
    all:           "Barchasi",
    filter:        "Filtrlash",
    clear:         "Tozalash",
    search:        "Qidiruv",
    sort:          "Saralash",
    showMore:      "Ko'proq ko'rish",
    bookNow:       "Bron qilish",
    learnMore:     "Batafsil",
    viewAll:       "Barchasini ko'rish",
    loading:       "Yuklanmoqda...",
    noResults:     "Hech narsa topilmadi",
    noResultsDesc: "Filtrlarni o'zgartirib ko'ring.",
    days:          "kun",
    hours:         "soat",
    perDay:        "bir kunga",
    from:          "dan boshlab",
    reviews:       "sharh",
    verified:      "Tekshirilgan",
    rating:        "Reyting",
    experience:    "yil tajriba",
    seats:         "o'rin",
    unesco:        "UNESCO",
    city:          "Shahar",
    price:         "Narx",
    minPrice:      "Min $",
    maxPrice:      "Max $",
    sortByRating:  "Eng yuqori reyting",
    sortByReviews: "Ko'p sharh",
    sortByPriceAsc:  "Arzonroq",
    sortByPriceDesc: "Qimmatroq",
    sortByNewest:  "Yangi",
    allCities:     "Hamma shaharlar",
    register:      "Ro'yxatdan o'tish",
    joinPartner:   "Hamkor bo'lish",
    highlights:    "Diqqatga sazovor joylar",
    bestTime:      "Eng yaxshi vaqt",
    distance:      "Toshkentdan masofa",
    avgTemp:       "O'rtacha harorat",
  },

  // Booking form
  booking: {
    title:       "Bron qilish",
    name:        "Ism va familiya",
    email:       "Email manzil",
    phone:       "Telefon raqam",
    nationality: "Fuqarolik",
    startDate:   "Boshlanish sanasi",
    endDate:     "Tugash sanasi",
    people:      "Odamlar soni",
    message:     "Qo'shimcha xabar",
    send:        "Zayavka yuborish",
    sending:     "Yuborilmoqda...",
    success:     "Zayavkangiz qabul qilindi! Mutaxassis siz bilan bog'lanadi.",
    error:       "Xato yuz berdi. Qayta urinib ko'ring.",
  },

  // Footer
  footer: {
    description: "bayConnect — O'zbekiston va Markaziy Osiyo bo'ylab ishonchli turizm xizmatlarini topish uchun global marketplace.",
    experts:     "Mutaxassislar",
    transfer:    "Transfer",
    discover:    "Kashf qiling",
    company:     "Kompaniya",
    copyright:   "Barcha huquqlar himoyalangan.",
    region:      "O'zbekiston · Markaziy Osiyo",
    contact:     "Aloqa",
    privacy:     "Maxfiylik",
    becomeExpert: "Mutaxassis bo'lish",
  },

  // Viza sahifasi
  visa: {
    free:     "Visasiz",
    evisa:    "E-viza",
    voa:      "Chegara viza",
    required: "Viza kerak",
    maxDays:  "Maksimal kun",
    apply:    "Ariza topshirish",
    applyOnline: "Online ariza",
    freeDesc:    "Pasportingiz bilan kirish",
    evisaDesc:   "Online ariza — 3 kun ichida",
    voaDesc:     "Aeroport yoki chegara punktida",
  },
};

const en: Translations = {
  nav: {
    home:         "Home",
    experts:      "Experts",
    destinations: "Destinations",
    experiences:  "Experiences",
    transfer:     "Transfer",
    hotels:       "Hotels",
    itineraries:  "Itineraries",
    visaInfo:     "Visa Info",
    blog:         "Blog",
    stats:        "Stats",
    favorites:    "Favorites",
    register:     "Become a Partner",
    tourPackages: "Tour Packages",
    community:    "BayCommunity",
  },

  hero: {
    badge:       "Guides, transfers & travel services all in one place",
    title:       "The easiest way to",
    titleAccent: "explore Uzbekistan",
    titleEnd:    "with local experts.",
    subtitle:    "Find verified guides, photographers, transfers & hotels on one trusted platform. Transparent pricing, real reviews.",
    ctaExperts:  "Browse Experts",
    ctaTours:    "Tour Packages",
    searchPlaceholder: "Search — city, name or service...",
    trust1:      "Verified profiles",
    trust2:      "Transparent pricing",
    trust3:      "Fast booking",
  },

  pages: {
    experts: {
      title:    "Tourism Experts",
      subtitle: "Guides, interpreters, photographers and tour operators.",
      eyebrow:  "People",
    },
    destinations: {
      title:    "Uzbekistan Destinations",
      subtitle: "From Registan Square to Itchan Kala — the finest travel destinations.",
      eyebrow:  "Destinations",
    },
    experiences: {
      title:    "Unique Experiences",
      subtitle: "Silk weaving, bread baking, horseback riding — with local artisans.",
      eyebrow:  "Experiences",
    },
    itineraries: {
      title:    "Ready-made Itineraries",
      subtitle: "From the Silk Road classics to mountain adventures — find your perfect route.",
      eyebrow:  "Itineraries",
    },
    visaInfo: {
      title:    "Visa Information",
      subtitle: "Entry to Uzbekistan — e-visa, visa on arrival, and visa-free regimes.",
      eyebrow:  "Visa",
    },
    hotels: {
      title:    "Hotels",
      subtitle: "From boutique guesthouses to modern 4-star hotels.",
      eyebrow:  "Accommodation",
    },
    transfer: {
      title:    "Transfer Services",
      subtitle: "Sedan to bus — for any group size and route.",
      eyebrow:  "Transfer",
    },
  },

  ui: {
    all:           "All",
    filter:        "Filter",
    clear:         "Clear",
    search:        "Search",
    sort:          "Sort",
    showMore:      "Show more",
    bookNow:       "Book Now",
    learnMore:     "Learn More",
    viewAll:       "View All",
    loading:       "Loading...",
    noResults:     "Nothing found",
    noResultsDesc: "Try adjusting your filters.",
    days:          "days",
    hours:         "hours",
    perDay:        "per day",
    from:          "from",
    reviews:       "reviews",
    verified:      "Verified",
    rating:        "Rating",
    experience:    "yrs exp.",
    seats:         "seats",
    unesco:        "UNESCO",
    city:          "City",
    price:         "Price",
    minPrice:      "Min $",
    maxPrice:      "Max $",
    sortByRating:  "Top rated",
    sortByReviews: "Most reviewed",
    sortByPriceAsc:  "Cheapest first",
    sortByPriceDesc: "Most expensive",
    sortByNewest:  "Newest",
    allCities:     "All cities",
    register:      "Register",
    joinPartner:   "Become a Partner",
    highlights:    "Highlights",
    bestTime:      "Best Time to Visit",
    distance:      "Distance from Tashkent",
    avgTemp:       "Average Temperature",
  },

  booking: {
    title:       "Book Now",
    name:        "Full name",
    email:       "Email address",
    phone:       "Phone number",
    nationality: "Nationality",
    startDate:   "Start date",
    endDate:     "End date",
    people:      "Number of people",
    message:     "Additional message",
    send:        "Send Request",
    sending:     "Sending...",
    success:     "Your request was received! The expert will contact you shortly.",
    error:       "Something went wrong. Please try again.",
  },

  footer: {
    description: "bayConnect — a global marketplace for trusted tourism services across Uzbekistan and Central Asia.",
    experts:     "Experts",
    transfer:    "Transfer",
    discover:    "Discover",
    company:     "Company",
    copyright:   "All rights reserved.",
    region:      "Uzbekistan · Central Asia",
    contact:     "Contact",
    privacy:     "Privacy Policy",
    becomeExpert: "Become an Expert",
  },

  visa: {
    free:        "Visa-free",
    evisa:       "E-Visa",
    voa:         "Visa on Arrival",
    required:    "Visa Required",
    maxDays:     "Max stay (days)",
    apply:       "Apply Now",
    applyOnline: "Apply Online",
    freeDesc:    "Entry with passport only",
    evisaDesc:   "Online application — processed in 3 days",
    voaDesc:     "Available at airport or border crossing",
  },
};

const ru: Translations = {
  nav: {
    home:         "Главная",
    experts:      "Специалисты",
    destinations: "Направления",
    experiences:  "Впечатления",
    transfer:     "Трансфер",
    hotels:       "Отели",
    itineraries:  "Маршруты",
    visaInfo:     "Визовая информация",
    blog:         "Блог",
    stats:        "Статистика",
    favorites:    "Избранное",
    register:     "Стать партнёром",
    tourPackages: "Турпакеты",
    community:    "BayCommunity",
  },

  hero: {
    badge:       "Гиды, трансфер и туристические услуги в одном месте",
    title:       "Самый простой способ",
    titleAccent: "открыть Узбекистан",
    titleEnd:    "с местными экспертами.",
    subtitle:    "Найдите проверенных гидов, фотографов, трансфер и отели на одной платформе. Прозрачные цены, реальные отзывы.",
    ctaExperts:  "Смотреть специалистов",
    ctaTours:    "Турпакеты",
    searchPlaceholder: "Поиск — город, имя или услуга...",
    trust1:      "Проверенные профили",
    trust2:      "Прозрачные цены",
    trust3:      "Быстрое бронирование",
  },

  pages: {
    experts: {
      title:    "Туристические специалисты",
      subtitle: "Гиды, переводчики, фотографы и туроператоры.",
      eyebrow:  "Люди",
    },
    destinations: {
      title:    "Направления Узбекистана",
      subtitle: "От площади Регистан до Ичан-Калы — лучшие туристические направления.",
      eyebrow:  "Направления",
    },
    experiences: {
      title:    "Уникальные впечатления",
      subtitle: "Шёлкоткачество, выпечка лепёшки, верховая езда — с местными мастерами.",
      eyebrow:  "Впечатления",
    },
    itineraries: {
      title:    "Готовые маршруты",
      subtitle: "От классического Шёлкового пути до горных приключений.",
      eyebrow:  "Маршруты",
    },
    visaInfo: {
      title:    "Визовая информация",
      subtitle: "Въезд в Узбекистан — электронная виза, виза по прибытии и безвизовый режим.",
      eyebrow:  "Виза",
    },
    hotels: {
      title:    "Отели",
      subtitle: "От бутик-гостевых домов до современных 4-звёздочных отелей.",
      eyebrow:  "Размещение",
    },
    transfer: {
      title:    "Трансферные услуги",
      subtitle: "От легкового автомобиля до автобуса — для любой группы.",
      eyebrow:  "Трансфер",
    },
  },

  ui: {
    all:           "Все",
    filter:        "Фильтр",
    clear:         "Сбросить",
    search:        "Поиск",
    sort:          "Сортировка",
    showMore:      "Показать ещё",
    bookNow:       "Забронировать",
    learnMore:     "Подробнее",
    viewAll:       "Смотреть все",
    loading:       "Загрузка...",
    noResults:     "Ничего не найдено",
    noResultsDesc: "Попробуйте изменить фильтры.",
    days:          "дней",
    hours:         "часов",
    perDay:        "в день",
    from:          "от",
    reviews:       "отзывов",
    verified:      "Проверен",
    rating:        "Рейтинг",
    experience:    "лет опыта",
    seats:         "мест",
    unesco:        "ЮНЕСКО",
    city:          "Город",
    price:         "Цена",
    minPrice:      "Мин $",
    maxPrice:      "Макс $",
    sortByRating:  "По рейтингу",
    sortByReviews: "По отзывам",
    sortByPriceAsc:  "Дешевле",
    sortByPriceDesc: "Дороже",
    sortByNewest:  "Новые",
    allCities:     "Все города",
    register:      "Регистрация",
    joinPartner:   "Стать партнёром",
    highlights:    "Достопримечательности",
    bestTime:      "Лучшее время для посещения",
    distance:      "Расстояние от Ташкента",
    avgTemp:       "Средняя температура",
  },

  booking: {
    title:       "Бронирование",
    name:        "Имя и фамилия",
    email:       "Адрес эл. почты",
    phone:       "Номер телефона",
    nationality: "Гражданство",
    startDate:   "Дата начала",
    endDate:     "Дата окончания",
    people:      "Количество человек",
    message:     "Дополнительное сообщение",
    send:        "Отправить заявку",
    sending:     "Отправка...",
    success:     "Заявка принята! Специалист свяжется с вами.",
    error:       "Произошла ошибка. Попробуйте ещё раз.",
  },

  footer: {
    description: "bayConnect — глобальный маркетплейс надёжных туристических услуг по Узбекистану и Центральной Азии.",
    experts:     "Специалисты",
    transfer:    "Трансфер",
    discover:    "Исследуйте",
    company:     "Компания",
    copyright:   "Все права защищены.",
    region:      "Узбекистан · Центральная Азия",
    contact:     "Контакты",
    privacy:     "Политика конфиденциальности",
    becomeExpert: "Стать специалистом",
  },

  visa: {
    free:        "Безвизовый",
    evisa:       "Электронная виза",
    voa:         "Виза по прибытии",
    required:    "Нужна виза",
    maxDays:     "Макс. срок (дней)",
    apply:       "Подать заявку",
    applyOnline: "Онлайн заявка",
    freeDesc:    "Вход только по паспорту",
    evisaDesc:   "Онлайн заявка — обработка 3 дня",
    voaDesc:     "Доступна в аэропорту или на границе",
  },
};

/* ==========================================================================
   TARJIMA OLISH FUNKSIYASI
   ========================================================================== */
const DICT: Record<LangCode, Translations> = { uz, en, ru };

export function getT(lang: LangCode = "uz"): Translations {
  return DICT[lang] ?? DICT.uz;
}

/**
 * Cookie'dan til kodini o'qiydi.
 * Server Component'larda ishlatiladi: cookies() bilan.
 */
export function parseLangCookie(cookieValue: string | undefined): LangCode {
  if (!cookieValue) return DEFAULT_LANG;
  const trimmed = cookieValue.trim() as LangCode;
  return SUPPORTED_LANG_CODES.includes(trimmed) ? trimmed : DEFAULT_LANG;
}

/**
 * Accept-Language sarlavhasidan til aniqlaydi.
 * Masalan: "en-US,en;q=0.9,ru;q=0.8,uz;q=0.7" → "en"
 */
export function detectLangFromHeader(acceptLanguage: string | null): LangCode {
  if (!acceptLanguage) return DEFAULT_LANG;
  const codes = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase().slice(0, 2));
  for (const code of codes) {
    if (SUPPORTED_LANG_CODES.includes(code as LangCode)) return code as LangCode;
  }
  return DEFAULT_LANG;
}

/**
 * URL search param yoki header'dan tilni aniqlaydi.
 * ?lang=en yoki Accept-Language sarlavhasi.
 */
export function resolveLang(
  searchParamLang: string | undefined,
  acceptLanguage: string | null = null,
  cookieLang: string | undefined = undefined,
): LangCode {
  // 1. URL param: ?lang=en eng ustun
  if (searchParamLang && SUPPORTED_LANG_CODES.includes(searchParamLang as LangCode)) {
    return searchParamLang as LangCode;
  }
  // 2. Cookie
  if (cookieLang && SUPPORTED_LANG_CODES.includes(cookieLang as LangCode)) {
    return cookieLang as LangCode;
  }
  // 3. Accept-Language
  return detectLangFromHeader(acceptLanguage);
}

/* ==========================================================================
   MATN YORDAMCHILARI
   ========================================================================== */

/** Til kodiga qarab ko'p tilli qiymat qaytaradi */
export function pickLang<T extends { uz?: string; en?: string; ru?: string }>(
  obj: T,
  lang: LangCode,
): string {
  return obj[lang] ?? obj.en ?? obj.uz ?? "";
}

/** Destinatsiya uchun til tanlash */
export function destTitle(d: { titleUz: string; titleEn: string; titleRu: string }, lang: LangCode): string {
  if (lang === "en") return d.titleEn;
  if (lang === "ru") return d.titleRu;
  return d.titleUz;
}

export function destDesc(d: { descriptionUz: string; descriptionEn: string; descriptionRu: string }, lang: LangCode): string {
  if (lang === "en") return d.descriptionEn;
  if (lang === "ru") return d.descriptionRu;
  return d.descriptionUz;
}

export function destTagline(d: { taglineUz: string; taglineEn: string; taglineRu: string }, lang: LangCode): string {
  if (lang === "en") return d.taglineEn;
  if (lang === "ru") return d.taglineRu;
  return d.taglineUz;
}

/** Experience uchun til tanlash */
export function expTitle(e: { titleUz: string; titleEn: string; titleRu: string }, lang: LangCode): string {
  if (lang === "en") return e.titleEn;
  if (lang === "ru") return e.titleRu;
  return e.titleUz;
}

export function expDesc(e: { descriptionUz: string; descriptionEn: string; descriptionRu: string }, lang: LangCode): string {
  if (lang === "en") return e.descriptionEn;
  if (lang === "ru") return e.descriptionRu;
  return e.descriptionUz;
}

/** Provider bio uchun */
export function providerBio(p: { bio: string; bioEn: string; bioRu: string }, lang: LangCode): string {
  if (lang === "en" && p.bioEn) return p.bioEn;
  if (lang === "ru" && p.bioRu) return p.bioRu;
  return p.bio;
}

/** Itinerary uchun */
export function itiTitle(i: { titleUz: string; titleEn: string; titleRu: string }, lang: LangCode): string {
  if (lang === "en") return i.titleEn;
  if (lang === "ru") return i.titleRu;
  return i.titleUz;
}

export function itiDesc(i: { descriptionUz: string; descriptionEn: string; descriptionRu: string }, lang: LangCode): string {
  if (lang === "en") return i.descriptionEn;
  if (lang === "ru") return i.descriptionRu;
  return i.descriptionUz;
}
