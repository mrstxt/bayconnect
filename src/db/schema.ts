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
} from "drizzle-orm/pg-core";

// Turizm mutaxassislari (gid, transfer, tarjimon, fotograf, mehmonxona va h.k.)
export const providers = pgTable("providers", {
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
  avatarEmoji: varchar("avatar_emoji", { length: 8 }).notNull().default("🌴"),
  coverColor: varchar("cover_color", { length: 20 }).notNull().default("orange"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("5.00"),
  reviewsCount: integer("reviews_count").notNull().default(0),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const bookings = pgTable("bookings", {
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
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id")
    .notNull()
    .references(() => providers.id, { onDelete: "cascade" }),
  authorName: varchar("author_name", { length: 160 }).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Blog maqolalari
export const posts = pgTable("posts", {
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
});

export type Provider = typeof providers.$inferSelect;
export type NewProvider = typeof providers.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
