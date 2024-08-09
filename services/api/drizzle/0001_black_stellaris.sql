ALTER TABLE "evaluations" RENAME COLUMN "model_id" TO "model";--> statement-breakpoint
ALTER TABLE "evaluations" DROP CONSTRAINT "evaluations_model_id_models_id_fk";
--> statement-breakpoint
ALTER TABLE "evaluations" ALTER COLUMN "model" SET DATA TYPE varchar(255);