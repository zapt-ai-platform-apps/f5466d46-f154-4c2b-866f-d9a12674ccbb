CREATE TABLE IF NOT EXISTS "cart_items" (
  "id" SERIAL PRIMARY KEY,
  "cart_id" INTEGER NOT NULL REFERENCES "carts"("id"),
  "product_id" INTEGER NOT NULL REFERENCES "products"("id"),
  "variant_id" INTEGER REFERENCES "product_variants"("id"),
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);