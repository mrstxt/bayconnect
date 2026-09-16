// bayConnect 2.0 — brand tokens + i18n labels + destinations + experiences

/* ==========================================================================
   MILLIY RANG PALITRASIDAN ILHOM OLGAN BREND TOKENLAR
   Lapis lazuli, feruza, oltin zar, gilem qizili
   ========================================================================== */
export const brand = {
  name: "bayConnect",
  tagline: "Discover Uzbekistan",
  taglineUz: "O'zbekistonga xush kelibsiz",
  taglineRu: "Добро пожаловать в Узбекистан",
  taglineEn: "Discover the Heart of the Silk Road",
  colors: {
    // Milliy ranglar
    lapis: "#1B4A8A",        // Registon gumbazi — asosiy ko'k
    lapisDark: "#0F2F5C",    // Chuqur lapis
    lapisLight: "#2A6BC7",   // Yorug' lapis
    feroza: "#0D7377",       // O'zbek zarduz — asosiy yashil-ko'k
    ferozaDark: "#095559",   // Chuqur feruza
    ferozaLight: "#14A9AE",  // Yorug' feruza
    zar: "#C8930A",          // Oltin zar — Samarqand mozaikasi
    zarLight: "#E9C46A",     // Yorug' oltin
    zarBright: "#F4A90A",    // Juda yorug' oltin
    gilem: "#8B2500",        // O'zbek gilamlari — chuqur qizil
    gilemLight: "#C1440E",   // Gilem yorug'
    gilemBright: "#E05535",  // Aksent qizil
    // Fon va sathlar
    parchment: "#FAF4E8",    // Parcha — asosiy fon
    marble: "#F5EFE4",       // Marmar — ikkinchi fon
    surface: "#FDF8F0",      // Yuzalar
    cream: "#F5EFE4",        // Krem (eski nom, saqlanadi)
    ink: "#1A1A2E",          // Asosiy matn rangi
    inkDeep: "#0D0D1A",      // Eng chuqur matn
    muted: "#6B6B7B",        // Ikkinchi darajali matn
    white: "#FFFFFF",
    // Eski nomlar (backward compat)
    coral: "#E05535",
    coralDark: "#C1440E",
    yellow: "#E9C46A",
    blue: "#1B4A8A",
    green: "#0D7377",
    deepGreen: "#095559",
  },
};

/* ==========================================================================
   TIL KODI TURLARI
   ========================================================================== */
export type LangCode = "uz" | "en" | "ru";

export const SUPPORTED_LANGS: { code: LangCode; label: string; flag: string }[] = [
  { code: "uz", label: "O'zbek",  flag: "🇺🇿" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

/* ==========================================================================
   ASOSIY KATEGORIYALAR
   ========================================================================== */
export const CATEGORIES = [
  {
    key: "guide",
    label: "Gid",
    labelEn: "Guide",
    labelRu: "Гид",
    emoji: "🕌",
    color: "orange",
    description: "Tarixiy va madaniy ekskursiyalar",
    descriptionEn: "Historical & cultural tours",
    descriptionRu: "Исторические и культурные экскурсии",
  },
  {
    key: "translator",
    label: "Tarjimon",
    labelEn: "Interpreter",
    labelRu: "Переводчик",
    emoji: "🗣️",
    color: "dark",
    description: "Sinxron va yo'riqnoma tarjima",
    descriptionEn: "Simultaneous & consecutive interpretation",
    descriptionRu: "Синхронный и последовательный перевод",
  },
  {
    key: "photographer",
    label: "Fotograf",
    labelEn: "Photographer",
    labelRu: "Фотограф",
    emoji: "📸",
    color: "orange",
    description: "Sayohat va portret suratlar",
    descriptionEn: "Travel & portrait photography",
    descriptionRu: "Путешествия и портретная съёмка",
  },
  {
    key: "tour_agent",
    label: "Tur operator",
    labelEn: "Tour Operator",
    labelRu: "Турагент",
    emoji: "🌍",
    color: "blue",
    description: "To'liq paket va viza yordami",
    descriptionEn: "Full packages & visa assistance",
    descriptionRu: "Полные пакеты и визовая помощь",
  },
  {
    key: "transfer",
    label: "Transfer",
    labelEn: "Transfer",
    labelRu: "Трансфер",
    emoji: "✈️",
    color: "blue",
    description: "Aeroport va shaharlararo",
    descriptionEn: "Airport & intercity transfers",
    descriptionRu: "Аэропорт и межгородские переводы",
  },
  {
    key: "tourism_service",
    label: "Turizm xizmati",
    labelEn: "Tourism Service",
    labelRu: "Туристический сервис",
    emoji: "🤝",
    color: "green",
    description: "Turizm yo'nalishidagi boshqa xizmatlar",
    descriptionEn: "Other tourism-related services",
    descriptionRu: "Прочие туристические услуги",
  },
  {
    key: "hotel",
    label: "Mehmonxona",
    labelEn: "Hotel",
    labelRu: "Отель",
    emoji: "🏨",
    color: "yellow",
    description: "Qulay joylashuv",
    descriptionEn: "Comfortable accommodation",
    descriptionRu: "Комфортное размещение",
  },
] as const;

export const EXPERT_CATEGORIES = [
  {
    key: "guide",
    label: "Gidlar",
    labelEn: "Guides",
    labelRu: "Гиды",
    emoji: "🕌",
    color: "orange",
    description: "Mahalliy tarix va madaniyat mutaxassislari",
    descriptionEn: "Local history & culture specialists",
    descriptionRu: "Специалисты по местной истории и культуре",
  },
  {
    key: "translator",
    label: "Tarjimonlar",
    labelEn: "Interpreters",
    labelRu: "Переводчики",
    emoji: "🗣️",
    color: "dark",
    description: "Sinxron va ketma-ket tarjima",
    descriptionEn: "Simultaneous & consecutive interpretation",
    descriptionRu: "Синхронный и последовательный перевод",
  },
  {
    key: "photographer",
    label: "Fotograflar",
    labelEn: "Photographers",
    labelRu: "Фотографы",
    emoji: "📸",
    color: "orange",
    description: "Sayohat va portret ustalar",
    descriptionEn: "Travel & portrait masters",
    descriptionRu: "Мастера путешествий и портретной съёмки",
  },
  {
    key: "tour_agent",
    label: "Tur operatorlar",
    labelEn: "Tour Operators",
    labelRu: "Туроператоры",
    emoji: "🌍",
    color: "blue",
    description: "Kompleks paket va viza",
    descriptionEn: "Full packages & visa services",
    descriptionRu: "Комплексные пакеты и визовое обслуживание",
  },
  {
    key: "tourism_service",
    label: "Turizm xizmatlari",
    labelEn: "Tourism Services",
    labelRu: "Турсервис",
    emoji: "🤝",
    color: "green",
    description: "Turizm yo'nalishidagi servis mutaxassislari",
    descriptionEn: "Tourism-oriented service specialists",
    descriptionRu: "Специалисты туристического сервиса",
  },
] as const;

export const TRANSFER_TYPES = [
  {
    key: "sedan",
    label: "Yengil avto",
    labelEn: "Sedan",
    labelRu: "Легковой",
    emoji: "🚗",
    capacity: "1–4",
    description: "Sedan va krossover",
    descriptionEn: "Sedan & crossover cars",
    descriptionRu: "Седан и кроссовер",
  },
  {
    key: "minivan",
    label: "Minivan",
    labelEn: "Minivan",
    labelRu: "Минивэн",
    emoji: "🚐",
    capacity: "5–8",
    description: "Kichik guruhlar uchun",
    descriptionEn: "For small groups",
    descriptionRu: "Для малых групп",
  },
  {
    key: "suv",
    label: "Yo'ltanlamas",
    labelEn: "SUV",
    labelRu: "Внедорожник",
    emoji: "🚙",
    capacity: "4–7",
    description: "Tog' va qishloq yo'llari",
    descriptionEn: "Mountain & off-road routes",
    descriptionRu: "Горные и сельские дороги",
  },
  {
    key: "bus",
    label: "Avtobus",
    labelEn: "Bus",
    labelRu: "Автобус",
    emoji: "🚌",
    capacity: "20–50",
    description: "Katta guruh va tur",
    descriptionEn: "Large groups & tours",
    descriptionRu: "Большие группы и туры",
  },
  {
    key: "airport",
    label: "Aeroport",
    labelEn: "Airport",
    labelRu: "Аэропорт",
    emoji: "✈️",
    capacity: "1–8",
    description: "24/7 aeroport transferi",
    descriptionEn: "24/7 airport transfer",
    descriptionRu: "Трансфер 24/7",
  },
] as const;

export type CategoryKey  = (typeof CATEGORIES)[number]["key"];
export type TransferKey  = (typeof TRANSFER_TYPES)[number]["key"];

/* ==========================================================================
   DESTINATSIYALAR — Chet ellik turistlar uchun asosiy yo'nalishlar
   ========================================================================== */
export const DESTINATIONS = [
  {
    key: "samarkand",
    city: "Samarqand",
    label: "Samarqand",
    labelEn: "Samarkand",
    labelRu: "Самарканд",
    tagline: "Sharqning yulduzi",
    taglineEn: "The Star of the East",
    taglineRu: "Звезда Востока",
    description: "Registon maydoni, Shoh-i-Zinda va Ko'k Gumbaz bilan jahonga mashhur shahar.",
    descriptionEn: "Home to the legendary Registan Square, Shah-i-Zinda necropolis and the Gur-e-Amir mausoleum.",
    descriptionRu: "Город Регистана, Шахи-Зинды и Гур-Э-Амира — жемчужина Шёлкового пути.",
    emoji: "🕌",
    color: "lapis",
    highlights: ["Registon", "Shoh-i-Zinda", "Ko'k Gumbaz", "Bibixonim"],
    highlightsEn: ["Registan Square", "Shah-i-Zinda", "Gur-e-Amir", "Bibi-Khanym Mosque"],
    bestMonths: ["Apr", "May", "Sep", "Oct"],
    avgTempC: 18,
    distanceFromTashkentKm: 350,
    unescoSite: true,
  },
  {
    key: "bukhara",
    city: "Buxoro",
    label: "Buxoro",
    labelEn: "Bukhara",
    labelRu: "Бухара",
    tagline: "Muqaddas shahar",
    taglineEn: "The Holy City",
    taglineRu: "Священный город",
    description: "UNESCO ro'yxatidagi qadimiy shahar — 140 dan ortiq me'moriy yodgorliklar.",
    descriptionEn: "UNESCO-listed ancient city with over 140 architectural monuments spanning 25 centuries.",
    descriptionRu: "Древний город под охраной ЮНЕСКО со 140+ архитектурными памятниками.",
    emoji: "🏛️",
    color: "zar",
    highlights: ["Ark qal'asi", "Kalon minorasi", "Labi-hovuz", "Nodir Devonbegi"],
    highlightsEn: ["Ark Citadel", "Kalon Minaret", "Lyabi-Hauz", "Nadir Divan-Beghi"],
    bestMonths: ["Mar", "Apr", "Oct", "Nov"],
    avgTempC: 16,
    distanceFromTashkentKm: 580,
    unescoSite: true,
  },
  {
    key: "khiva",
    city: "Xiva",
    label: "Xiva",
    labelEn: "Khiva",
    labelRu: "Хива",
    tagline: "Ochiq osmon ostidagi muzey",
    taglineEn: "The Open-Air Museum",
    taglineRu: "Музей под открытым небом",
    description: "Ichan-Qal'a — butun shahar UNESCO tomonidan qo'riqlanadigan muzeyga aylangan.",
    descriptionEn: "Itchan Kala walled inner city — an entire living museum under UNESCO protection.",
    descriptionRu: "Ичан-Кала — город-крепость под охраной ЮНЕСКО, живой музей.",
    emoji: "🏰",
    color: "gilem",
    highlights: ["Ichan-Qal'a", "Islom Xo'ja minorasi", "Kuhna Ark", "Jumamasjid"],
    highlightsEn: ["Itchan Kala", "Islam Khoja Minaret", "Kunya-Ark", "Juma Mosque"],
    bestMonths: ["Apr", "May", "Sep", "Oct"],
    avgTempC: 15,
    distanceFromTashkentKm: 1100,
    unescoSite: true,
  },
  {
    key: "tashkent",
    city: "Toshkent",
    label: "Toshkent",
    labelEn: "Tashkent",
    labelRu: "Ташкент",
    tagline: "Markaziy Osiyoning yuragi",
    taglineEn: "Heart of Central Asia",
    taglineRu: "Сердце Центральной Азии",
    description: "Zamonaviy metro, qadimiy chorsu bozori va xush taomlar shahri.",
    descriptionEn: "A vibrant capital blending Soviet architecture, ancient bazaars and world-class cuisine.",
    descriptionRu: "Живая столица с советскими памятниками, древними базарами и отличной кухней.",
    emoji: "🌆",
    color: "feroza",
    highlights: ["Chorsu bozori", "Hazrat Imom", "Metro", "Ipak yo'li markazi"],
    highlightsEn: ["Chorsu Bazaar", "Khast Imam", "Tashkent Metro", "Silk Road Centre"],
    bestMonths: ["Apr", "May", "Sep", "Oct"],
    avgTempC: 19,
    distanceFromTashkentKm: 0,
    unescoSite: false,
  },
  {
    key: "shahrisabz",
    city: "Shahrisabz",
    label: "Shahrisabz",
    labelEn: "Shahrisabz",
    labelRu: "Шахрисабз",
    tagline: "Amir Temurning vatani",
    taglineEn: "Birthplace of Timur",
    taglineRu: "Родина Тамерлана",
    description: "Amir Temur tavallud topgan shahar — ulkan Oqsaroy va Dor ul-Huffoz.",
    descriptionEn: "Birthplace of Timur the Great — featuring the colossal Ak-Saray Palace ruins.",
    descriptionRu: "Родной город Тамерлана с руинами дворца Ак-Сарай.",
    emoji: "👑",
    color: "zar",
    highlights: ["Oqsaroy", "Dor us-Siyodat", "Ko'k Gumbaz", "Jahongir maqbarasi"],
    highlightsEn: ["Ak-Saray Palace", "Dorus-Saodat", "Kok-Gumbaz Mosque", "Jahangir Mausoleum"],
    bestMonths: ["Apr", "May", "Sep", "Oct"],
    avgTempC: 16,
    distanceFromTashkentKm: 400,
    unescoSite: true,
  },
  {
    key: "fergana",
    city: "Farg'ona vodiysi",
    label: "Farg'ona vodiysi",
    labelEn: "Fergana Valley",
    labelRu: "Ферганская долина",
    tagline: "Ipak va atlas vatani",
    taglineEn: "Land of Silk & Ikat",
    taglineRu: "Родина шёлка и атласа",
    description: "Margilan atlasi, Rishton keramikasi va Qo'qon xonligi tarixi.",
    descriptionEn: "Famous for Margilan ikat silk, Rishtan ceramics and the Kokand Khanate history.",
    descriptionRu: "Маргиланский шёлк, риштанская керамика и история Кокандского ханства.",
    emoji: "🧵",
    color: "gilem",
    highlights: ["Margilan ipak zavodi", "Rishton kulolchiligi", "Qo'qon xonligi", "Andijonda Bobur muzeyi"],
    highlightsEn: ["Yodgorlik Silk Factory", "Rishtan Ceramics", "Kokand Palace", "Babur Museum"],
    bestMonths: ["May", "Jun", "Sep", "Oct"],
    avgTempC: 17,
    distanceFromTashkentKm: 320,
    unescoSite: false,
  },
] as const;

export type DestinationKey = (typeof DESTINATIONS)[number]["key"];

/* ==========================================================================
   NOYOB TAJRIBALAR — Chet ellik turistlar uchun
   ========================================================================== */
export const EXPERIENCES = [
  {
    key: "silk-weaving",
    title: "Atlas to'qish",
    titleEn: "Ikat Silk Weaving",
    titleRu: "Ткачество икат",
    description: "Margilan ustasi bilan qo'lda atlas to'qish jarayonini o'rganish.",
    descriptionEn: "Learn the ancient art of handmade ikat silk weaving with a Margilan master.",
    descriptionRu: "Освойте древнее искусство ручного ткачества икат с мастером из Маргилана.",
    emoji: "🧵",
    duration: "3 soat",
    durationEn: "3 hours",
    city: "Farg'ona",
    category: "craft",
    color: "gilem",
  },
  {
    key: "non-baking",
    title: "Non yopish",
    titleEn: "Uzbek Bread Baking",
    titleRu: "Выпечка лепёшки",
    description: "Tandir va qo'l bilan an'anaviy o'zbek nonini yopishni o'rganing.",
    descriptionEn: "Bake traditional Uzbek bread in a clay tandir oven with a local family.",
    descriptionRu: "Испеките традиционную узбекскую лепёшку в глиняном тандире.",
    emoji: "🫓",
    duration: "2 soat",
    durationEn: "2 hours",
    city: "Toshkent",
    category: "culinary",
    color: "zar",
  },
  {
    key: "pottery",
    title: "Rishton kulolchiligi",
    titleEn: "Rishtan Ceramics",
    titleRu: "Риштанская керамика",
    description: "Ming yillik an'anaga ega Rishton kulolchiligi ustasidan saboq oling.",
    descriptionEn: "Take a hands-on masterclass in Rishtan's thousand-year-old ceramic tradition.",
    descriptionRu: "Мастер-класс по тысячелетней традиции риштанской керамики.",
    emoji: "🏺",
    duration: "4 soat",
    durationEn: "4 hours",
    city: "Rishton",
    category: "craft",
    color: "lapis",
  },
  {
    key: "horse-riding",
    title: "Ot minish",
    titleEn: "Horse Riding",
    titleRu: "Верховая езда",
    description: "O'zbek dasht va tog'larida milliy ot minish an'anasini his eting.",
    descriptionEn: "Experience traditional Uzbek horsemanship through steppe and mountain trails.",
    descriptionRu: "Почувствуйте традиционное узбекское искусство верховой езды.",
    emoji: "🐴",
    duration: "Yarim kun",
    durationEn: "Half day",
    city: "Samarqand",
    category: "outdoor",
    color: "feroza",
  },
  {
    key: "embroidery",
    title: "Zardo'zi tikish",
    titleEn: "Zardozi Embroidery",
    titleRu: "Золотое шитьё",
    description: "Buxoro oltin kashtachiligini o'zbek hunarmanddan o'rganing.",
    descriptionEn: "Learn the exquisite Bukhara gold embroidery technique from a local artisan.",
    descriptionRu: "Освойте технику бухарского золотого шитья у местного мастера.",
    emoji: "🪡",
    duration: "3 soat",
    durationEn: "3 hours",
    city: "Buxoro",
    category: "craft",
    color: "zar",
  },
  {
    key: "plov-cooking",
    title: "O'zbek oshi",
    titleEn: "Uzbek Plov Cooking",
    titleRu: "Приготовление плова",
    description: "Samarqandcha osh pishirishni ustadan o'rganing — qazan, guruch va sirlar.",
    descriptionEn: "Master the art of Uzbek plov with a Samarkand chef — the national dish.",
    descriptionRu: "Научитесь готовить узбекский плов у повара из Самарканда.",
    emoji: "🍛",
    duration: "3 soat",
    durationEn: "3 hours",
    city: "Samarqand",
    category: "culinary",
    color: "orange",
  },
  {
    key: "calligraphy",
    title: "Arab xattotligi",
    titleEn: "Arabic Calligraphy",
    titleRu: "Арабская каллиграфия",
    description: "O'zbek xattot ustasidan qalam bilan arab harflarini yozishni o'rganing.",
    descriptionEn: "Learn the ancient art of Arabic calligraphy from an Uzbek master calligrapher.",
    descriptionRu: "Изучите древнее искусство арабской каллиграфии у узбекского мастера.",
    emoji: "✍️",
    duration: "2 soat",
    durationEn: "2 hours",
    city: "Buxoro",
    category: "art",
    color: "lapis",
  },
  {
    key: "bazaar-tour",
    title: "Bozor safari",
    titleEn: "Bazaar Food Tour",
    titleRu: "Гастрономический тур по базару",
    description: "Chorsu yoki Siob bozorida mahalliy gid bilan o'zbek taomlarini tatib ko'ring.",
    descriptionEn: "Explore Chorsu or Siab bazaar with a local guide, tasting authentic Uzbek food.",
    descriptionRu: "Исследуйте рынок Чорсу или Сиаб с гидом, дегустируя узбекскую кухню.",
    emoji: "🥘",
    duration: "2.5 soat",
    durationEn: "2.5 hours",
    city: "Toshkent / Samarqand",
    category: "culinary",
    color: "orange",
  },
] as const;

export type ExperienceKey = (typeof EXPERIENCES)[number]["key"];

/* ==========================================================================
   ITINERARIYLAR — Tayyor marshrutlar
   ========================================================================== */
export const ITINERARIES = [
  {
    key: "silk-road-classic",
    title: "Klassik Ipak Yo'li",
    titleEn: "Classic Silk Road",
    titleRu: "Классический Шёлковый путь",
    days: 10,
    description: "Toshkent → Samarqand → Buxoro → Xiva → Toshkent",
    descriptionEn: "Tashkent → Samarkand → Bukhara → Khiva → Tashkent",
    destinations: ["tashkent", "samarkand", "bukhara", "khiva"],
    difficulty: "easy",
    color: "lapis",
    bestFor: ["Birinchi marta", "Juftliklar", "Oilalar"],
    bestForEn: ["First timers", "Couples", "Families"],
    priceFrom: 1200,
    priceCurrency: "USD",
  },
  {
    key: "heritage-deep",
    title: "Chuqur meros",
    titleEn: "Deep Heritage",
    titleRu: "Глубокое наследие",
    days: 14,
    description: "Barcha UNESCO joylar + noyob tajribalar",
    descriptionEn: "All UNESCO sites + unique local experiences",
    destinations: ["tashkent", "samarkand", "shahrisabz", "bukhara", "khiva"],
    difficulty: "moderate",
    color: "zar",
    bestFor: ["Tarix muxlislari", "Madaniyat sayohati"],
    bestForEn: ["History buffs", "Cultural immersion"],
    priceFrom: 1800,
    priceCurrency: "USD",
  },
  {
    key: "craft-culture",
    title: "Hunarmandchilik va madaniyat",
    titleEn: "Crafts & Culture",
    titleRu: "Ремёсла и культура",
    days: 7,
    description: "Atlas, kulolchilik, zardo'zi va milliy taomlar",
    descriptionEn: "Silk, ceramics, embroidery and Uzbek culinary arts",
    destinations: ["tashkent", "fergana", "samarkand"],
    difficulty: "easy",
    color: "gilem",
    bestFor: ["Hunarmandchilik", "Gastro sayohat"],
    bestForEn: ["Craft lovers", "Foodies"],
    priceFrom: 900,
    priceCurrency: "USD",
  },
] as const;

export type ItineraryKey = (typeof ITINERARIES)[number]["key"];

/* ==========================================================================
   VIZA MA'LUMOTLARI
   ========================================================================== */
export type VisaType = "free" | "evisa" | "voa" | "required";

export const VISA_INFO_BY_REGION = [
  {
    region: "CIS",
    regionEn: "CIS Countries",
    regionRu: "Страны СНГ",
    countries: ["Russia", "Kazakhstan", "Kyrgyzstan", "Tajikistan", "Armenia", "Azerbaijan", "Moldova", "Belarus"],
    visaType: "free" as VisaType,
    maxDays: 30,
    note: "Pasport bilan kirish",
    noteEn: "Entry with passport only",
  },
  {
    region: "Yevropa / Shimoliy Amerika / Osiyo",
    regionEn: "Europe / North America / Asia",
    regionRu: "Европа / Северная Америка / Азия",
    countries: ["USA", "UK", "Germany", "France", "Japan", "South Korea", "Israel", "UAE", "Turkey", "China", "Australia", "Canada"],
    visaType: "evisa" as VisaType,
    maxDays: 30,
    note: "E-viza — online ariza 3 kun ichida",
    noteEn: "E-visa — online application, processed in 3 days",
    evisaUrl: "https://e-visa.gov.uz",
  },
  {
    region: "Hindiston, Pokiston va boshqalar",
    regionEn: "India, Pakistan & Others",
    regionRu: "Индия, Пакистан и другие",
    countries: ["India", "Pakistan", "Bangladesh", "Nepal", "Sri Lanka"],
    visaType: "voa" as VisaType,
    maxDays: 30,
    note: "Chegara yoki aeroportda viza",
    noteEn: "Visa on arrival at border or airport",
  },
] as const;

/* ==========================================================================
   OBUNA REJALARI
   ========================================================================== */
export const SPECIALIST_PLANS = [
  {
    key: "start",
    label: "Start",
    priceMonthly: 99000,
    features: ["Katalogda profil", "Telefon va Telegram kontakt", "BayCommunity kirish"],
    featuresEn: ["Profile in catalog", "Phone & Telegram contact", "BayCommunity access"],
  },
  {
    key: "pro",
    label: "Pro",
    priceMonthly: 199000,
    features: ["Yuqoriroq ko'rinish", "Buyurtma bildirishnomasi", "Statistika", "BayCommunity kirish"],
    featuresEn: ["Higher visibility", "Booking notifications", "Analytics", "BayCommunity access"],
  },
  {
    key: "premium",
    label: "Premium",
    priceMonthly: 399000,
    features: ["Top joylashuv", "Verified badge", "Promo postlar", "Ustuvor support", "BayCommunity kirish"],
    featuresEn: ["Top placement", "Verified badge", "Promo posts", "Priority support", "BayCommunity access"],
  },
] as const;

export const COMMUNITY_PLAN = {
  key: "baycommunity",
  label: "BayCommunity",
  priceMonthly: 49000,
  features: ["Yopiq community guruh", "Hamkorlar va imkoniyatlar", "E'lonlar va yangiliklar", "Networking"],
  featuresEn: ["Private community group", "Partners & opportunities", "Announcements & news", "Networking"],
} as const;

/* ==========================================================================
   SHAHARLAR
   ========================================================================== */
export const CITIES = [
  "Toshkent",
  "Samarqand",
  "Buxoro",
  "Xiva",
  "Chimyon",
  "Andijon",
  "Namangan",
  "Farg'ona",
  "Nukus",
  "Qarshi",
  "Termiz",
  "Shahrisabz",
  "Rishton",
  "Marg'ilon",
  "Jizzax",
] as const;

/* ==========================================================================
   NAVIGATSIYA
   ========================================================================== */
export const PARTNER_NAME = "bayTrip";
export const PARTNER_URL  = "https://baytrip.vercel.app";

export const NAV_ITEMS = [
  { href: "/",            label: "Bosh sahifa",   labelEn: "Home",         labelRu: "Главная",         external: false },
  { href: "/experts",     label: "Mutaxassislar", labelEn: "Experts",      labelRu: "Специалисты",     external: false },
  { href: "/destinations",label: "Manzillar",     labelEn: "Destinations", labelRu: "Направления",     external: false },
  { href: "/experiences", label: "Tajribalar",    labelEn: "Experiences",  labelRu: "Впечатления",     external: false },
  { href: "/transfer",    label: "Transfer",      labelEn: "Transfer",     labelRu: "Трансфер",        external: false },
  { href: "/hotels",      label: "Mehmonxonalar", labelEn: "Hotels",       labelRu: "Отели",           external: false },
  { href: "/itineraries", label: "Marshrutlar",   labelEn: "Itineraries",  labelRu: "Маршруты",        external: false },
  { href: "/visa-info",   label: "Viza",          labelEn: "Visa Info",    labelRu: "Виза",            external: false },
  { href: "/blog",        label: "Blog",          labelEn: "Blog",         labelRu: "Блог",            external: false },
] as const;

/* ==========================================================================
   YORDAMCHI FUNKSIYALAR
   ========================================================================== */

export function categoryLabel(key: string, lang: LangCode = "uz"): string {
  const cat = CATEGORIES.find((c) => c.key === key);
  if (!cat) return key;
  if (lang === "en") return cat.labelEn;
  if (lang === "ru") return cat.labelRu;
  return cat.label;
}

export function categoryEmoji(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.emoji ?? "🌴";
}

export function categoryMeta(key: string) {
  return CATEGORIES.find((c) => c.key === key);
}

export function transferMeta(key: string) {
  return TRANSFER_TYPES.find((t) => t.key === key);
}

export function transferLabel(key: string, lang: LangCode = "uz"): string {
  const t = TRANSFER_TYPES.find((t) => t.key === key);
  if (!t) return key;
  if (lang === "en") return t.labelEn;
  if (lang === "ru") return t.labelRu;
  return t.label;
}

export function destinationMeta(key: string) {
  return DESTINATIONS.find((d) => d.key === key);
}

export function destinationLabel(key: string, lang: LangCode = "uz"): string {
  const d = DESTINATIONS.find((d) => d.key === key);
  if (!d) return key;
  if (lang === "en") return d.labelEn;
  if (lang === "ru") return d.labelRu;
  return d.label;
}

export function coverBg(color: string): string {
  switch (color) {
    case "yellow":
    case "zar":
      return "bg-gradient-to-br from-[#f0b429] via-[#c8930a] to-[#9a6e07]";
    case "blue":
    case "lapis":
      return "bg-gradient-to-br from-[#2a6bc7] via-[#1b4a8a] to-[#0f2f5c]";
    case "dark":
      return "bg-gradient-to-br from-[#1a2e4a] via-[#0f1e30] to-[#0a1220]";
    case "green":
    case "feroza":
      return "bg-gradient-to-br from-[#14a9ae] via-[#0d7377] to-[#095559]";
    case "gilem":
      return "bg-gradient-to-br from-[#e05535] via-[#c1440e] to-[#8b2500]";
    case "orange":
    default:
      return "bg-gradient-to-br from-[#e05535] via-[#c1440e] to-[#8b2500]";
  }
}

export function categoryGradient(color: string): string {
  switch (color) {
    case "yellow":
    case "zar":
      return "linear-gradient(135deg,#f0b429,#c8930a)";
    case "blue":
    case "lapis":
      return "linear-gradient(135deg,#2a6bc7,#1b4a8a)";
    case "dark":
      return "linear-gradient(135deg,#1f3a5c,#0f2440)";
    case "green":
    case "feroza":
      return "linear-gradient(135deg,#14a9ae,#0d7377)";
    case "gilem":
      return "linear-gradient(135deg,#e05535,#c1440e)";
    case "orange":
    default:
      return "linear-gradient(135deg,#e05535,#c1440e)";
  }
}

export function destinationGradient(key: string): string {
  const d = DESTINATIONS.find((x) => x.key === key);
  return categoryGradient(d?.color ?? "lapis");
}

export function formatPrice(value: number | string): string {
  const n = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatRating(value: number | string): string {
  return Number(value).toFixed(1);
}

export function formatPriceUZS(value: number): string {
  return new Intl.NumberFormat("uz-UZ").format(value) + " so'm";
}
