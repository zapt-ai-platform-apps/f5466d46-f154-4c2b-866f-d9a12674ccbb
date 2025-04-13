CREATE TABLE IF NOT EXISTS "coupons" (
  "id" SERIAL PRIMARY KEY,
  "code" TEXT UNIQUE NOT NULL,
  "description" TEXT,
  "discount_type" TEXT NOT NULL,
  "discount_value" DECIMAL(10, 2) NOT NULL,
  "min_purchase" DECIMAL(10, 2) DEFAULT 0,
  "max_discount" DECIMAL(10, 2),
  "start_date" TIMESTAMP,
  "end_date" TIMESTAMP,
  "usage_limit" INTEGER,
  "used_count" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);