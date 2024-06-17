import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.PostgresUri!,
  },
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
});
