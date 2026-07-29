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
} from "drizzle-orm/pg-core";

// Turizm mutaxassislari (gid, transfer, tarjimon, fotograf, mehmonxona va h.k.)
export const providers = pgTable(
  "providers",
  {
    id: serial("id").primaryKey(),
    fullName: varchar("full_name", { length: 160 }).notNull(),
    category: varchar("category", { length: 40 }).notNull(),
    // guide | transfer | photographer | translator | tour_agent | hotel
    subCategory: varchar("sub_category", { length: 40 }).notNull().default(""),
    // for transfer: sedan | minivan | suv | bus | airport
    city: varchar("city", { length: 80 }).notNull(),
    country: varchar("country", { length: 80 }).notNull().default("Uzbekistan"),
    languages: jsonb("languages").$type<string[]>().notNull().default([]),
    pricePerDay: integer("price_per_day").notNull(),
    experienceYears: integer("experience_years").notNull().default(0),
    capacity: integer("capacity").notNull().default(0), // transport uchun o'rindiqlar soni
    bio: text("bio").notNull(),
    phone: varchar("phone", { length: 40 }).notNull(),
    email: varchar("email", { length: 160 }).notNull(),
    // Telegram botdagi chat: buyurtmalar bevosita shu yerga yuboriladi.
    telegramChatId: varchar("telegram_chat_id", { length: 32 }).unique(),
    telegramUserId: varchar("telegram_user_id", { length: 32 }),
    telegramUsername: varchar("telegram_username", { length: 80 }),
    avatarEmoji: varchar("avatar_emoji", { length: 8 }).notNull().default("🌴"),
    coverColor: varchar("cover_color", { length: 20 }).notNull().default("orange"),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("5.00"),
    reviewsCount: integer("reviews_count").notNull().default(0),
    verified: boolean("verified").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // /experts, /transfer, /hotels sahifalari doim category bo'yicha filtrlaydi.
    index("providers_category_idx").on(t.category),
    // Transfer sahifasidagi tur (sedan/minivan/...) filtri.
    index("providers_category_sub_idx").on(t.category, t.subCategory),
    // Shahar bo'yicha filtr.
    index("providers_city_idx").on(t.city),
    // Narx bo'yicha saralash va min/max diapazon.
    index("providers_price_idx").on(t.pricePerDay),
    // Default saralash: verified → rating → reviews.
    index("providers_rank_idx").on(t.verified, t.rating, t.reviewsCount),
    // "Yangi" saralash.
    index("providers_created_idx").on(t.createdAt),
    index("providers_telegram_user_idx").on(t.telegramUserId),
  ],
);

export const subscriptionPlans = pgTable(
  "subscription_plans",
  {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 40 }).notNull().unique(),
    audience: varchar("audience", { length: 30 }).notNull(),
    // specialist | community
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
    // all | specialist | community
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
    // specialist | community
    providerId: integer("provider_id").references(() => providers.id, { onDelete: "cascade" }),
    telegramUserId: varchar("telegram_user_id", { length: 32 }),
    telegramUsername: varchar("telegram_username", { length: 80 }),
    planKey: varchar("plan_key", { length: 40 }).notNull(),
    status: varchar("status", { length: 30 }).notNull().default("pending"),
    // pending | active | expired | canceled | payment_required
    promoCode: varchar("promo_code", { length: 40 }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("subscriptions_provider_idx").on(t.providerId),
    index("subscriptions_telegram_user_idx").on(t.telegramUserId),
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
    // payment_required | approved | joined | expired | rejected
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
    // pending | verified | expired
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
    startDate: varchar("start_date", { length: 20 }).notNull(),
    endDate: varchar("end_date", { length: 20 }).notNull(),
    peopleCount: integer("people_count").notNull().default(1),
    message: text("message").notNull().default(""),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("bookings_provider_idx").on(t.providerId),
    index("bookings_created_idx").on(t.createdAt),
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
    rating: integer("rating").notNull(),
    comment: text("comment").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // Provider sahifasi: WHERE provider_id = ? ORDER BY created_at DESC
    index("reviews_provider_created_idx").on(t.providerId, t.createdAt),
  ],
);

// Blog maqolalari
export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 220 }).notNull(),
    slug: varchar("slug", { length: 240 }).notNull().unique(),
    excerpt: text("excerpt").notNull(),
    body: text("body").notNull(),
    emoji: varchar("emoji", { length: 8 }).notNull().default("📖"),
    coverColor: varchar("cover_color", { length: 20 }).notNull().default("orange"),
    category: varchar("category", { length: 40 }).notNull().default("guide"),
    // guide | tips | destination | story
    readMinutes: integer("read_minutes").notNull().default(3),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("posts_created_idx").on(t.createdAt),
    index("posts_category_created_idx").on(t.category, t.createdAt),
  ],
);

export type Provider = typeof providers.$inferSelect;
export type NewProvider = typeof providers.$inferInsert;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type PromoCode = typeof promoCodes.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type CommunityAccessRequest = typeof communityAccessRequests.$inferSelect;
export type TelegramVerification = typeof telegramVerifications.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type TelegramRegistration = typeof telegramRegistrations.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
