CREATE TABLE IF NOT EXISTS "orders" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID,
  "guest_email" TEXT,
  "guest_phone" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "total_amount" DECIMAL(10, 2) NOT NULL,
  "shipping_address_id" INTEGER REFERENCES "addresses"("id"),
  "shipping_method" TEXT,
  "shipping_cost" DECIMAL(10, 2) DEFAULT 0,
  "payment_method" TEXT,
  "payment_status" TEXT NOT NULL DEFAULT 'pending',
  "transaction_id" TEXT,
  "notes" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);