import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";
import { env } from "../env";

// Making the connection does't get recreated on HMR
const globalForPostgres = globalThis as unknown as { db?: postgres.Sql };

const connection =
  globalForPostgres.db ??
  postgres(env.POSTGRES_URI, {
    max: env.POSTGRES_MIGRATING ? 1 : undefined,
  });

if (!globalForPostgres.db) globalForPostgres.db = connection;

export const db = drizzle(connection, { schema });
