CREATE TABLE IF NOT EXISTS "product_health_goals" (
  "product_id" INTEGER NOT NULL REFERENCES "products"("id"),
  "goal_id" INTEGER NOT NULL REFERENCES "health_goals"("id"),
  "created_at" TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY ("product_id", "goal_id")
);