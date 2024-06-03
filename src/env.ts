import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import "dotenv/config";

export const env = createEnv({
  server: {
    POSTGRES_URI: z.string().url(),
    POSTGRES_MIGRATING: z.string().optional(),
    PLANETSCALE_DB_URI: z.string().url(),
    AUTH_TOKEN: z.string().min(32),
    DISCORD_WEBHOOK_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PORT: z.coerce.number().default(3000),
  },
  runtimeEnv: process.env,
});
