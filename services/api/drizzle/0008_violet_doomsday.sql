CREATE TABLE IF NOT EXISTS "api_key" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"api_key" varchar(255) NOT NULL,
	"query_count" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "api_key_api_key_unique" UNIQUE("api_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "csv_evaluations" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_name" text NOT NULL,
	"average_score" numeric(5, 4) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_key" ADD CONSTRAINT "api_key_client_fk" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
