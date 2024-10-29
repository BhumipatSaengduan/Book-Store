ALTER TABLE "users_to_books" DROP CONSTRAINT "users_to_books_user_id_books_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_books" ADD CONSTRAINT "users_to_books_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
