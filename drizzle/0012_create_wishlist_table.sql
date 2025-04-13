CREATE TABLE IF NOT EXISTS "wishlists" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL,
  "product_id" INTEGER NOT NULL REFERENCES "products"("id"),
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW(),
  UNIQUE ("user_id", "product_id")
);