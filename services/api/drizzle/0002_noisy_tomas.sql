CREATE TABLE IF NOT EXISTS "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"config_id" integer,
	"evaluation_id" integer,
	"content" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"profession" text NOT NULL,
	"location" text NOT NULL,
	"bio" text NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"handles" json NOT NULL,
	"avatar" text NOT NULL,
	"api_key" json NOT NULL,
	"reviews" json NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"configs" json NOT NULL,
	"evaluations" json NOT NULL,
	"reports" json NOT NULL,
	"settings" json NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "configs" ADD COLUMN "rating" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "models" ADD COLUMN "company" text;--> statement-breakpoint
ALTER TABLE "models" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "models" ADD COLUMN "tags" json;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_config_id_configs_id_fk" FOREIGN KEY ("config_id") REFERENCES "configs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_evaluation_id_evaluations_id_fk" FOREIGN KEY ("evaluation_id") REFERENCES "evaluations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
