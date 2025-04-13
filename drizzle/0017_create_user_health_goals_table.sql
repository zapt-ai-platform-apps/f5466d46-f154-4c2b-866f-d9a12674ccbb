CREATE TABLE IF NOT EXISTS "user_health_goals" (
  "user_id" UUID NOT NULL,
  "goal_id" INTEGER NOT NULL REFERENCES "health_goals"("id"),
  "created_at" TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY ("user_id", "goal_id")
);