CREATE TABLE IF NOT EXISTS "users" (
  "id" UUID PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "phone" TEXT UNIQUE,
  "first_name" TEXT,
  "last_name" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);