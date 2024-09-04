CREATE TABLE IF NOT EXISTS "evaluations" (
	"id" serial PRIMARY KEY NOT NULL,
	"model" text NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"output" text,
	"score" numeric(5, 4),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "models" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "models_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"evaluation_id" integer,
	"content" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reports" ADD CONSTRAINT "reports_evaluation_id_evaluations_id_fk" FOREIGN KEY ("evaluation_id") REFERENCES "evaluations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
