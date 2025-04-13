CREATE TABLE IF NOT EXISTS "carts" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID,
  "guest_id" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);