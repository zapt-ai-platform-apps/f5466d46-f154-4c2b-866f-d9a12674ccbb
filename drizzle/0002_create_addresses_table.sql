CREATE TABLE IF NOT EXISTS "addresses" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL,
  "is_default" BOOLEAN DEFAULT FALSE,
  "full_name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "address_line1" TEXT NOT NULL,
  "address_line2" TEXT,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "postal_code" TEXT NOT NULL,
  "country" TEXT NOT NULL DEFAULT 'India',
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);