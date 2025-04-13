CREATE TABLE IF NOT EXISTS "subscriptions" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL,
  "product_id" INTEGER NOT NULL REFERENCES "products"("id"),
  "variant_id" INTEGER REFERENCES "product_variants"("id"),
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "frequency_days" INTEGER NOT NULL,
  "next_delivery_date" TIMESTAMP NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "shipping_address_id" INTEGER REFERENCES "addresses"("id"),
  "payment_method_id" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);