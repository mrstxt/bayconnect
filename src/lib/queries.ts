import { db } from "@/db";
import { providers } from "@/db/schema";
import { and, eq, ilike, desc, gte, lte, or, inArray, SQL } from "drizzle-orm";

export type ListFilters = {
  category?: string | string[];
  subCategory?: string;
  city?: string;
  q?: string;
  min?: string;
  max?: string;
  sort?: string;
};

export async function listProviders(filters: ListFilters) {
  const conditions: SQL[] = [];

  if (filters.category) {
    if (Array.isArray(filters.category)) {
      conditions.push(inArray(providers.category, filters.category));
    } else {
      conditions.push(eq(providers.category, filters.category));
    }
  }

  if (filters.subCategory) {
    conditions.push(eq(providers.subCategory, filters.subCategory));
  }

  if (filters.city) {
    conditions.push(ilike(providers.city, `%${filters.city}%`));
  }

  if (filters.q) {
    const like = `%${filters.q}%`;
    const qCond = or(
      ilike(providers.fullName, like),
      ilike(providers.bio, like),
      ilike(providers.city, like),
    );
    if (qCond) conditions.push(qCond);
  }

  if (filters.min && !Number.isNaN(Number(filters.min))) {
    conditions.push(gte(providers.pricePerDay, Number(filters.min)));
  }
  if (filters.max && !Number.isNaN(Number(filters.max))) {
    conditions.push(lte(providers.pricePerDay, Number(filters.max)));
  }

  let orderBy;
  switch (filters.sort) {
    case "price_asc":
      orderBy = [providers.pricePerDay];
      break;
    case "price_desc":
      orderBy = [desc(providers.pricePerDay)];
      break;
    case "reviews":
      orderBy = [desc(providers.reviewsCount), desc(providers.rating)];
      break;
    case "newest":
      orderBy = [desc(providers.createdAt)];
      break;
    default:
      orderBy = [desc(providers.verified), desc(providers.rating), desc(providers.reviewsCount)];
  }

  return db
    .select()
    .from(providers)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(...orderBy);
}
