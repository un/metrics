import { defineConfig } from "drizzle-kit";
import { env } from "./src/env";
import "dotenv/config";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRES_URI,
  },
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
});
