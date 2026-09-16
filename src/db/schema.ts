import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  boolean,
  numeric,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* ==========================================================================
   PROVIDERS — Turizm mutaxassislari
   ========================================================================== */
export const providers = pgTable(
  "providers",
  {
    id: serial("id").primaryKey(),
    fullName: varchar("full_name", { length: 160 }).notNull(),
    category: varchar("category", { length: 40 }).notNull(),
    // guide | transfer | photographer | translator | tour_agent | hotel | tourism_service
    subCategory: varchar("sub_category", { length: 40 }).notNull().default(""),
    // for transfer: sedan | minivan | suv | bus | airport
    city: varchar("city", { length: 80 }).notNull(),
    country: varchar("country", { length: 80 }).notNull().default("Uzbekistan"),
    languages: jsonb("languages").$type<string[]>().notNull().default([]),
    pricePerDay: integer("price_per_day").notNull(),
    experienceYears: integer("experience_years").notNull().default(0),
    capacity: integer("capacity").notNull().default(0),
    bio: text("bio").notNull(),
    // Ko'p tilli bio — chet ellik turistlar uchun
    bioEn: text("bio_en").notNull().default(""),
    bioRu: text("bio_ru").notNull().default(""),
    phone: varchar("phone", { length: 40 }).notNull(),
    email: varchar("email", { length: 160 }).notNull(),
    telegramChatId: varchar("telegram_chat_id", { length: 32 }).unique(),
    telegramUserId: varchar("telegram_user_id", { length: 32 }),
    telegramUsername: varchar("telegram_username", { length: 80 }),
    avatarEmoji: varchar("avatar_emoji", { length: 8 }).notNull().default("🌴"),
    coverColor: varchar("cover_color", { length: 20 }).notNull().default("lapis"),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    // Destination bog'liq teglar (Samarqand, Buxoro, ...)
    destinations: jsonb("destinations").$type<string[]>().notNull().default([]),
    rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("5.00"),
    reviewsCount: integer("reviews_count").notNull().default(0),
    verified: boolean("verified").notNull().default(false),
    // Qaysi tilda gapiradi (guide/translator uchun muhim)
    spokenLangs: jsonb("spoken_langs").$type<string[]>().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("providers_category_idx").on(t.category),
    index("providers_category_sub_idx").on(t.category, t.subCategory),
    index("providers_city_idx").on(t.city),
    index("providers_price_idx").on(t.pricePerDay),
    index("providers_rank_idx").on(t.verified, t.rating, t.reviewsCount),
    index("providers_created_idx").on(t.createdAt),
    index("providers_telegram_user_idx").on(t.telegramUserId),
  ],
);

/* ==========================================================================
   DESTINATIONS — Sayohat manzillari (ma'lumot + statistika uchun)
   ========================================================================== */
export const destinations = pgTable(
  "destinations",
  {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 60 }).notNull().unique(),
    // samarkand | bukhara | khiva | tashkent | ...
    city: varchar("city", { length: 80 }).notNull(),
    country: varchar("country", { length: 80 }).notNull().default("Uzbekistan"),

    // Ko'p tilli sarlavha va tavsif
    titleUz: varchar("title_uz", { length: 160 }).notNull(),
    titleEn: varchar("title_en", { length: 160 }).notNull(),
    titleRu: varchar("title_ru", { length: 160 }).notNull(),

    taglineUz: varchar("tagline_uz", { length: 220 }).notNull().default(""),
    taglineEn: varchar("tagline_en", { length: 220 }).notNull().default(""),
    taglineRu: varchar("tagline_ru", { length: 220 }).notNull().default(""),

    descriptionUz: text("description_uz").notNull().default(""),
    descriptionEn: text("description_en").notNull().default(""),
    descriptionRu: text("description_ru").notNull().default(""),

    // Metama'lumotlar
    emoji: varchar("emoji", { length: 8 }).notNull().default("🕌"),
    coverColor: varchar("cover_color", { length: 20 }).notNull().default("lapis"),
    unescoSite: boolean("unesco_site").notNull().default(false),
    distanceFromTashkentKm: integer("distance_from_tashkent_km").notNull().default(0),
    avgTempC: integer("avg_temp_c").notNull().default(17),
    bestMonths: jsonb("best_months").$type<string[]>().notNull().default([]),

    // Diqqatga sazovor joylar
    highlightsUz: jsonb("highlights_uz").$type<string[]>().notNull().default([]),
    highlightsEn: jsonb("highlights_en").$type<string[]>().notNull().default([]),

    // SEO
    metaDescEn: text("meta_desc_en").notNull().default(""),
    metaDescRu: text("meta_desc_ru").notNull().default(""),

    active: boolean("active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("destinations_key_idx").on(t.key),
    index("destinations_active_sort_idx").on(t.active, t.sortOrder),
    index("destinations_city_idx").on(t.city),
  ],
);

/* ==========================================================================
   EXPERIENCES — Noyob mahalliy tajribalar
   ========================================================================== */
export const experiences = pgTable(
  "experiences",
  {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 80 }).notNull().unique(),
    // silk-weaving | non-baking | pottery | horse-riding | ...
    destinationKey: varchar("destination_key", { length: 60 }).notNull().default(""),
    // Qaysi manzilga tegishli

    // Ko'p tilli mazmun
    titleUz: varchar("title_uz", { length: 180 }).notNull(),
    titleEn: varchar("title_en", { length: 180 }).notNull(),
    titleRu: varchar("title_ru", { length: 180 }).notNull(),

    descriptionUz: text("description_uz").notNull().default(""),
    descriptionEn: text("description_en").notNull().default(""),
    descriptionRu: text("description_ru").notNull().default(""),

    // Metama'lumotlar
    emoji: varchar("emoji", { length: 8 }).notNull().default("✨"),
    category: varchar("category", { length: 40 }).notNull().default("craft"),
    // craft | culinary | outdoor | art | cultural | adventure
    coverColor: varchar("cover_color", { length: 20 }).notNull().default("zar"),
    city: varchar("city", { length: 80 }).notNull().default(""),
    durationUz: varchar("duration_uz", { length: 60 }).notNull().default(""),
    durationEn: varchar("duration_en", { length: 60 }).notNull().default(""),

    // Narx
    priceFrom: integer("price_from").notNull().default(0),
    priceCurrency: varchar("price_currency", { length: 5 }).notNull().default("USD"),

    // Statistika
    rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("5.00"),
    reviewsCount: integer("reviews_count").notNull().default(0),

    active: boolean("active").notNull().default(true),
    featured: boolean("featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("experiences_key_idx").on(t.key),
    index("experiences_destination_idx").on(t.destinationKey),
    index("experiences_category_idx").on(t.category),
    index("experiences_active_featured_idx").on(t.active, t.featured),
    index("experiences_city_idx").on(t.city),
  ],
);

/* ==========================================================================
   ITINERARIES — Tayyor marshrutlar
   ========================================================================== */
export const itineraries = pgTable(
  "itineraries",
  {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 80 }).notNull().unique(),

    // Ko'p tilli sarlavha va tavsif
    titleUz: varchar("title_uz", { length: 200 }).notNull(),
    titleEn: varchar("title_en", { length: 200 }).notNull(),
    titleRu: varchar("title_ru", { length: 200 }).notNull(),

    descriptionUz: text("description_uz").notNull().default(""),
    descriptionEn: text("description_en").notNull().default(""),
    descriptionRu: text("description_ru").notNull().default(""),

    // Marshrut tafsilotlari
    days: integer("days").notNull().default(7),
    destinations: jsonb("destinations").$type<string[]>().notNull().default([]),
    // destination key'lari ro'yxati: ["tashkent","samarkand","bukhara"]
    difficulty: varchar("difficulty", { length: 20 }).notNull().default("easy"),
    // easy | moderate | hard
    coverColor: varchar("cover_color", { length: 20 }).notNull().default("lapis"),

    // Maqsadli auditoriya
    bestForUz: jsonb("best_for_uz").$type<string[]>().notNull().default([]),
    bestForEn: jsonb("best_for_en").$type<string[]>().notNull().default([]),

    // Kunlik dastur (JSON array of day objects)
    dayPlansUz: jsonb("day_plans_uz").$type<{ day: number; title: string; activities: string[] }[]>().notNull().default([]),
    dayPlansEn: jsonb("day_plans_en").$type<{ day: number; title: string; activities: string[] }[]>().notNull().default([]),

    // Narx
    priceFrom: integer("price_from").notNull().default(0),
    priceCurrency: varchar("price_currency", { length: 5 }).notNull().default("USD"),

    active: boolean("active").notNull().default(true),
    featured: boolean("featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("itineraries_key_idx").on(t.key),
    index("itineraries_active_featured_idx").on(t.active, t.featured),
    index("itineraries_days_idx").on(t.days),
  ],
);

/* ==========================================================================
   DESTINATION REVIEWS — Manzillar bo'yicha sharhlar
   ========================================================================== */
export const destinationReviews = pgTable(
  "destination_reviews",
  {
    id: serial("id").primaryKey(),
    destinationKey: varchar("destination_key", { length: 60 }).notNull(),
    authorName: varchar("author_name", { length: 160 }).notNull(),
    authorCountry: varchar("author_country", { length: 80 }).notNull().default(""),
    // Qaysi mamlakatdan kelgan turist
    authorLang: varchar("author_lang", { length: 5 }).notNull().default("en"),
    rating: integer("rating").notNull(),
    // 1–5
    comment: text("comment").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("dest_reviews_dest_idx").on(t.destinationKey),
    index("dest_reviews_created_idx").on(t.createdAt),
  ],
);

/* ==========================================================================
   VISA INQUIRIES — Viza so'rovlari
   ========================================================================== */
export const visaInquiries = pgTable(
  "visa_inquiries",
  {
    id: serial("id").primaryKey(),
    fullName: varchar("full_name", { length: 160 }).notNull(),
    email: varchar("email", { length: 160 }).notNull(),
    nationality: varchar("nationality", { length: 80 }).notNull(),
    passportNumber: varchar("passport_number", { length: 40 }).notNull().default(""),
    arrivalDate: varchar("arrival_date", { length: 20 }).notNull(),
    departureDate: varchar("departure_date", { length: 20 }).notNull(),
    visaType: varchar("visa_type", { length: 20 }).notNull().default("evisa"),
    // evisa | voa | free | required
    message: text("message").notNull().default(""),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    // pending | processing | done | rejected
    ipHash: varchar("ip_hash", { length: 64 }).notNull().default(""),
    // IP xesh (PII emas)
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("visa_inquiries_status_idx").on(t.status),
    index("visa_inquiries_created_idx").on(t.createdAt),
    index("visa_inquiries_nationality_idx").on(t.nationality),
  ],
);

/* ==========================================================================
   EXPERIENCE BOOKINGS — Tajriba bronlari
   ========================================================================== */
export const experienceBookings = pgTable(
  "experience_bookings",
  {
    id: serial("id").primaryKey(),
    experienceKey: varchar("experience_key", { length: 80 }).notNull(),
    clientName: varchar("client_name", { length: 160 }).notNull(),
    clientEmail: varchar("client_email", { length: 160 }).notNull(),
    clientPhone: varchar("client_phone", { length: 40 }).notNull(),
    clientNationality: varchar("client_nationality", { length: 80 }).notNull().default(""),
    preferredLang: varchar("preferred_lang", { length: 5 }).notNull().default("en"),
    date: varchar("date", { length: 20 }).notNull(),
    peopleCount: integer("people_count").notNull().default(1),
    message: text("message").notNull().default(""),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    ipHash: varchar("ip_hash", { length: 64 }).notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("exp_bookings_experience_idx").on(t.experienceKey),
    index("exp_bookings_status_idx").on(t.status),
    index("exp_bookings_created_idx").on(t.createdAt),
  ],
);

/* ==========================================================================
   SAQLANIB QOLGAN ESKI JADVALLAR
   ========================================================================== */

export const subscriptionPlans = pgTable(
  "subscription_plans",
  {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 40 }).notNull().unique(),
    audience: varchar("audience", { length: 30 }).notNull(),
    title: varchar("title", { length: 120 }).notNull(),
    priceMonthly: integer("price_monthly").notNull(),
    features: jsonb("features").$type<string[]>().notNull().default([]),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("subscription_plans_audience_idx").on(t.audience),
    index("subscription_plans_active_idx").on(t.active),
  ],
);

export const promoCodes = pgTable(
  "promo_codes",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 40 }).notNull().unique(),
    audience: varchar("audience", { length: 30 }).notNull().default("all"),
    freeMonths: integer("free_months").notNull().default(1),
    maxUses: integer("max_uses").notNull().default(0),
    usedCount: integer("used_count").notNull().default(0),
    active: boolean("active").notNull().default(true),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("promo_codes_code_idx").on(t.code),
    index("promo_codes_active_idx").on(t.active),
  ],
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: serial("id").primaryKey(),
    audience: varchar("audience", { length: 30 }).notNull(),
    providerId: integer("provider_id").references(() => providers.id, { onDelete: "cascade" }),
    telegramUserId: varchar("telegram_user_id", { length: 32 }),
    telegramUsername: varchar("telegram_username", { length: 80 }),
    fullName: varchar("full_name", { length: 160 }),
    phone: varchar("phone", { length: 40 }),
    planKey: varchar("plan_key", { length: 40 }).notNull(),
    status: varchar("status", { length: 30 }).notNull().default("pending"),
    promoCode: varchar("promo_code", { length: 40 }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("subscriptions_provider_idx").on(t.providerId),
    index("subscriptions_telegram_user_idx").on(t.telegramUserId),
    index("subscriptions_phone_idx").on(t.phone),
    index("subscriptions_status_expires_idx").on(t.status, t.expiresAt),
  ],
);

export const communityAccessRequests = pgTable(
  "community_access_requests",
  {
    id: serial("id").primaryKey(),
    fullName: varchar("full_name", { length: 160 }).notNull(),
    phone: varchar("phone", { length: 40 }).notNull().default(""),
    telegramUsername: varchar("telegram_username", { length: 80 }).notNull(),
    telegramUserId: varchar("telegram_user_id", { length: 32 }),
    audience: varchar("audience", { length: 30 }).notNull().default("community"),
    planKey: varchar("plan_key", { length: 40 }).notNull().default("baycommunity"),
    status: varchar("status", { length: 30 }).notNull().default("payment_required"),
    promoCode: varchar("promo_code", { length: 40 }),
    approvedUntil: timestamp("approved_until", { withTimezone: true }),
    joinedAt: timestamp("joined_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("community_access_username_idx").on(t.telegramUsername),
    index("community_access_user_idx").on(t.telegramUserId),
    index("community_access_status_idx").on(t.status),
  ],
);

export const telegramVerifications = pgTable(
  "telegram_verifications",
  {
    token: varchar("token", { length: 80 }).primaryKey(),
    telegramUserId: varchar("telegram_user_id", { length: 32 }),
    telegramUsername: varchar("telegram_username", { length: 80 }),
    status: varchar("status", { length: 30 }).notNull().default("pending"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("telegram_verifications_status_idx").on(t.status),
    index("telegram_verifications_expires_idx").on(t.expiresAt),
  ],
);

export const bookings = pgTable(
  "bookings",
  {
    id: serial("id").primaryKey(),
    providerId: integer("provider_id")
      .notNull()
      .references(() => providers.id, { onDelete: "cascade" }),
    clientName: varchar("client_name", { length: 160 }).notNull(),
    clientEmail: varchar("client_email", { length: 160 }).notNull(),
    clientPhone: varchar("client_phone", { length: 40 }).notNull(),
    clientNationality: varchar("client_nationality", { length: 80 }).notNull().default(""),
    preferredLang: varchar("preferred_lang", { length: 5 }).notNull().default("en"),
    startDate: varchar("start_date", { length: 20 }).notNull(),
    endDate: varchar("end_date", { length: 20 }).notNull(),
    peopleCount: integer("people_count").notNull().default(1),
    message: text("message").notNull().default(""),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    ipHash: varchar("ip_hash", { length: 64 }).notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("bookings_provider_idx").on(t.providerId),
    index("bookings_created_idx").on(t.createdAt),
    index("bookings_status_idx").on(t.status),
  ],
);

export const telegramRegistrations = pgTable(
  "telegram_registrations",
  {
    chatId: varchar("chat_id", { length: 32 }).primaryKey(),
    telegramUserId: varchar("telegram_user_id", { length: 32 }).notNull(),
    fullName: varchar("full_name", { length: 160 }).notNull().default(""),
    username: varchar("username", { length: 80 }).notNull().default(""),
    phone: varchar("phone", { length: 40 }).notNull().default(""),
    step: varchar("step", { length: 30 }).notNull().default("start"),
    data: jsonb("data").$type<Record<string, string>>().notNull().default({}),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("telegram_registrations_updated_idx").on(t.updatedAt)],
);

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    providerId: integer("provider_id")
      .notNull()
      .references(() => providers.id, { onDelete: "cascade" }),
    authorName: varchar("author_name", { length: 160 }).notNull(),
    authorCountry: varchar("author_country", { length: 80 }).notNull().default(""),
    authorLang: varchar("author_lang", { length: 5 }).notNull().default("uz"),
    rating: integer("rating").notNull(),
    comment: text("comment").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("reviews_provider_created_idx").on(t.providerId, t.createdAt),
  ],
);

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 220 }).notNull(),
    titleEn: varchar("title_en", { length: 220 }).notNull().default(""),
    titleRu: varchar("title_ru", { length: 220 }).notNull().default(""),
    slug: varchar("slug", { length: 240 }).notNull().unique(),
    excerpt: text("excerpt").notNull(),
    excerptEn: text("excerpt_en").notNull().default(""),
    excerptRu: text("excerpt_ru").notNull().default(""),
    body: text("body").notNull(),
    bodyEn: text("body_en").notNull().default(""),
    bodyRu: text("body_ru").notNull().default(""),
    emoji: varchar("emoji", { length: 8 }).notNull().default("📖"),
    coverColor: varchar("cover_color", { length: 20 }).notNull().default("lapis"),
    category: varchar("category", { length: 40 }).notNull().default("guide"),
    destinationKey: varchar("destination_key", { length: 60 }).notNull().default(""),
    readMinutes: integer("read_minutes").notNull().default(3),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("posts_created_idx").on(t.createdAt),
    index("posts_category_created_idx").on(t.category, t.createdAt),
    index("posts_destination_idx").on(t.destinationKey),
  ],
);

/* ==========================================================================
   TYPE EXPORTS
   ========================================================================== */
export type Provider             = typeof providers.$inferSelect;
export type NewProvider          = typeof providers.$inferInsert;
export type Destination          = typeof destinations.$inferSelect;
export type NewDestination       = typeof destinations.$inferInsert;
export type Experience           = typeof experiences.$inferSelect;
export type NewExperience        = typeof experiences.$inferInsert;
export type Itinerary            = typeof itineraries.$inferSelect;
export type NewItinerary         = typeof itineraries.$inferInsert;
export type DestinationReview    = typeof destinationReviews.$inferSelect;
export type VisaInquiry          = typeof visaInquiries.$inferSelect;
export type NewVisaInquiry       = typeof visaInquiries.$inferInsert;
export type ExperienceBooking    = typeof experienceBookings.$inferSelect;
export type NewExperienceBooking = typeof experienceBookings.$inferInsert;
export type SubscriptionPlan     = typeof subscriptionPlans.$inferSelect;
export type PromoCode            = typeof promoCodes.$inferSelect;
export type Subscription         = typeof subscriptions.$inferSelect;
export type CommunityAccessRequest = typeof communityAccessRequests.$inferSelect;
export type TelegramVerification = typeof telegramVerifications.$inferSelect;
export type Booking              = typeof bookings.$inferSelect;
export type NewBooking           = typeof bookings.$inferInsert;
export type TelegramRegistration = typeof telegramRegistrations.$inferSelect;
export type Review               = typeof reviews.$inferSelect;
export type NewReview            = typeof reviews.$inferInsert;
export type Post                 = typeof posts.$inferSelect;
export type NewPost              = typeof posts.$inferInsert;
