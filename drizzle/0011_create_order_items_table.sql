CREATE TABLE IF NOT EXISTS "order_items" (
  "id" SERIAL PRIMARY KEY,
  "order_id" INTEGER NOT NULL REFERENCES "orders"("id"),
  "product_id" INTEGER NOT NULL REFERENCES "products"("id"),
  "variant_id" INTEGER REFERENCES "product_variants"("id"),
  "name" TEXT NOT NULL,
  "price" DECIMAL(10, 2) NOT NULL,
  "quantity" INTEGER NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);