import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// The database URL now comes from .env (it used to be hard-coded in drizzle.config.json).
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
