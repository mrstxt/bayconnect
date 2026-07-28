CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"client_name" varchar(160) NOT NULL,
	"client_email" varchar(160) NOT NULL,
	"client_phone" varchar(40) NOT NULL,
	"start_date" varchar(20) NOT NULL,
	"end_date" varchar(20) NOT NULL,
	"people_count" integer DEFAULT 1 NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(220) NOT NULL,
	"slug" varchar(240) NOT NULL,
	"excerpt" text NOT NULL,
	"body" text NOT NULL,
	"emoji" varchar(8) DEFAULT '📖' NOT NULL,
	"cover_color" varchar(20) DEFAULT 'orange' NOT NULL,
	"category" varchar(40) DEFAULT 'guide' NOT NULL,
	"read_minutes" integer DEFAULT 3 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(160) NOT NULL,
	"category" varchar(40) NOT NULL,
	"sub_category" varchar(40) DEFAULT '' NOT NULL,
	"city" varchar(80) NOT NULL,
	"country" varchar(80) DEFAULT 'Uzbekistan' NOT NULL,
	"languages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"price_per_day" integer NOT NULL,
	"experience_years" integer DEFAULT 0 NOT NULL,
	"capacity" integer DEFAULT 0 NOT NULL,
	"bio" text NOT NULL,
	"phone" varchar(40) NOT NULL,
	"email" varchar(160) NOT NULL,
	"telegram_chat_id" varchar(32),
	"telegram_username" varchar(80),
	"avatar_emoji" varchar(8) DEFAULT '🌴' NOT NULL,
	"cover_color" varchar(20) DEFAULT 'orange' NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"rating" numeric(3, 2) DEFAULT '5.00' NOT NULL,
	"reviews_count" integer DEFAULT 0 NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "providers_telegram_chat_id_unique" UNIQUE("telegram_chat_id")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"author_name" varchar(160) NOT NULL,
	"rating" integer NOT NULL,
	"comment" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "telegram_registrations" (
	"chat_id" varchar(32) PRIMARY KEY NOT NULL,
	"telegram_user_id" varchar(32) NOT NULL,
	"full_name" varchar(160) DEFAULT '' NOT NULL,
	"username" varchar(80) DEFAULT '' NOT NULL,
	"phone" varchar(40) DEFAULT '' NOT NULL,
	"step" varchar(30) DEFAULT 'start' NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookings_provider_idx" ON "bookings" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "bookings_created_idx" ON "bookings" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "posts_created_idx" ON "posts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "posts_category_created_idx" ON "posts" USING btree ("category","created_at");--> statement-breakpoint
CREATE INDEX "providers_category_idx" ON "providers" USING btree ("category");--> statement-breakpoint
CREATE INDEX "providers_category_sub_idx" ON "providers" USING btree ("category","sub_category");--> statement-breakpoint
CREATE INDEX "providers_city_idx" ON "providers" USING btree ("city");--> statement-breakpoint
CREATE INDEX "providers_price_idx" ON "providers" USING btree ("price_per_day");--> statement-breakpoint
CREATE INDEX "providers_rank_idx" ON "providers" USING btree ("verified","rating","reviews_count");--> statement-breakpoint
CREATE INDEX "providers_created_idx" ON "providers" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "reviews_provider_created_idx" ON "reviews" USING btree ("provider_id","created_at");--> statement-breakpoint
CREATE INDEX "telegram_registrations_updated_idx" ON "telegram_registrations" USING btree ("updated_at");