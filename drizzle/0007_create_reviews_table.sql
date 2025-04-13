CREATE TABLE IF NOT EXISTS "reviews" (
  "id" SERIAL PRIMARY KEY,
  "product_id" INTEGER NOT NULL REFERENCES "products"("id"),
  "user_id" UUID NOT NULL,
  "rating" INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  "review_text" TEXT,
  "is_verified_purchase" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);