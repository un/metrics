import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";
import { Resource } from "sst";

export const db = drizzle(postgres(Resource.PostgresUri.value, { max: 1 }), { schema });
