CREATE TABLE IF NOT EXISTS "product_variants" (
  "id" SERIAL PRIMARY KEY,
  "product_id" INTEGER NOT NULL REFERENCES "products"("id"),
  "name" TEXT NOT NULL,
  "price" DECIMAL(10, 2) NOT NULL,
  "mrp" DECIMAL(10, 2) NOT NULL,
  "stock_quantity" INTEGER NOT NULL DEFAULT 0,
  "weight" TEXT,
  "sku" TEXT UNIQUE,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);