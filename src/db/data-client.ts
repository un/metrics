import { Client } from "@planetscale/database";
import { env } from "../env";

export const dataClient = new Client({
  url: env.PLANETSCALE_DB_URI,
});
