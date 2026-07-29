ALTER TABLE "providers" ADD COLUMN IF NOT EXISTS "telegram_user_id" varchar(32);

CREATE TABLE IF NOT EXISTS "subscription_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(40) NOT NULL UNIQUE,
	"audience" varchar(30) NOT NULL,
	"title" varchar(120) NOT NULL,
	"price_monthly" integer NOT NULL,
	"features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "promo_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(40) NOT NULL UNIQUE,
	"audience" varchar(30) DEFAULT 'all' NOT NULL,
	"free_months" integer DEFAULT 1 NOT NULL,
	"max_uses" integer DEFAULT 0 NOT NULL,
	"used_count" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"audience" varchar(30) NOT NULL,
	"provider_id" integer REFERENCES "public"."providers"("id") ON DELETE cascade,
	"telegram_user_id" varchar(32),
	"telegram_username" varchar(80),
	"plan_key" varchar(40) NOT NULL,
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"promo_code" varchar(40),
	"started_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "community_access_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(160) NOT NULL,
	"phone" varchar(40) DEFAULT '' NOT NULL,
	"telegram_username" varchar(80) NOT NULL,
	"telegram_user_id" varchar(32),
	"audience" varchar(30) DEFAULT 'community' NOT NULL,
	"plan_key" varchar(40) DEFAULT 'baycommunity' NOT NULL,
	"status" varchar(30) DEFAULT 'payment_required' NOT NULL,
	"promo_code" varchar(40),
	"approved_until" timestamp with time zone,
	"joined_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "providers_telegram_user_idx" ON "providers" USING btree ("telegram_user_id");
CREATE INDEX IF NOT EXISTS "subscription_plans_audience_idx" ON "subscription_plans" USING btree ("audience");
CREATE INDEX IF NOT EXISTS "subscription_plans_active_idx" ON "subscription_plans" USING btree ("active");
CREATE INDEX IF NOT EXISTS "promo_codes_code_idx" ON "promo_codes" USING btree ("code");
CREATE INDEX IF NOT EXISTS "promo_codes_active_idx" ON "promo_codes" USING btree ("active");
CREATE INDEX IF NOT EXISTS "subscriptions_provider_idx" ON "subscriptions" USING btree ("provider_id");
CREATE INDEX IF NOT EXISTS "subscriptions_telegram_user_idx" ON "subscriptions" USING btree ("telegram_user_id");
CREATE INDEX IF NOT EXISTS "subscriptions_status_expires_idx" ON "subscriptions" USING btree ("status","expires_at");
CREATE INDEX IF NOT EXISTS "community_access_username_idx" ON "community_access_requests" USING btree ("telegram_username");
CREATE INDEX IF NOT EXISTS "community_access_user_idx" ON "community_access_requests" USING btree ("telegram_user_id");
CREATE INDEX IF NOT EXISTS "community_access_status_idx" ON "community_access_requests" USING btree ("status");

INSERT INTO "subscription_plans" ("key", "audience", "title", "price_monthly", "features")
VALUES
	('start', 'specialist', 'Start', 99000, '["Katalogda profil", "Telefon va Telegram kontakt", "BayCommunity kirish"]'::jsonb),
	('pro', 'specialist', 'Pro', 199000, '["Yuqoriroq ko''rinish", "Buyurtma bildirishnomasi", "Statistika", "BayCommunity kirish"]'::jsonb),
	('premium', 'specialist', 'Premium', 399000, '["Top joylashuv", "Verified badge", "Promo postlar", "Ustuvor support", "BayCommunity kirish"]'::jsonb),
	('baycommunity', 'community', 'BayCommunity', 49000, '["Yopiq community guruh", "Hamkorlar va imkoniyatlar", "E''lonlar va yangiliklar", "Networking"]'::jsonb)
ON CONFLICT ("key") DO UPDATE SET
	"audience" = EXCLUDED."audience",
	"title" = EXCLUDED."title",
	"price_monthly" = EXCLUDED."price_monthly",
	"features" = EXCLUDED."features",
	"active" = true;

INSERT INTO "promo_codes" ("code", "audience", "free_months", "max_uses", "active")
VALUES
	('BAY1OY', 'all', 1, 100, true),
	('BAY3OY', 'all', 3, 50, true)
ON CONFLICT ("code") DO UPDATE SET
	"audience" = EXCLUDED."audience",
	"free_months" = EXCLUDED."free_months",
	"max_uses" = EXCLUDED."max_uses",
	"active" = true;
