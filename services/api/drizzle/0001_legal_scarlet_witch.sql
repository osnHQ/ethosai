CREATE TABLE IF NOT EXISTS "configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"tags" json NOT NULL,
	"review_status" text NOT NULL,
	"date_submitted" timestamp NOT NULL,
	"last_reviewed" timestamp NOT NULL,
	"submitted_by" json NOT NULL,
	CONSTRAINT "configs_name_unique" UNIQUE("name")
);
