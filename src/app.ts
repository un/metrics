import { getSnapshot, shouldTakeSnapshot } from "./cache";
import { takeSnapshot } from "./functions/take-snapshot";
import { sendReport } from "./functions/send-report";
import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import { env } from "./env";
import { Hono } from "hono";

const app = new Hono();

if (env.NODE_ENV === "development") app.use(logger());

app.get("/", (c) => c.json({ status: "I'm Alive 🏝️" }));

app.use("/api/*", async (c, next) => {
  if (c.req.header("Authorization") !== env.AUTH_TOKEN)
    return c.json({ error: "Unauthorized" }, 401);
  await next();
});

app.post("/api/take-snapshot", async (c) => {
  const lastSnapshot = await getSnapshot();
  if (lastSnapshot && !shouldTakeSnapshot(lastSnapshot)) {
    return c.json({ message: "Snapshot already taken today" });
  } else {
    const newSnapshot = await takeSnapshot();
    await sendReport(newSnapshot, lastSnapshot);
    return c.json(newSnapshot);
  }
});

app.get("/api/snapshot", async (c) => {
  const snapshot = await getSnapshot();
  return c.json(snapshot ?? { error: "No snapshot found" }, snapshot ? 200 : 404);
});

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  () => console.info(`Server running on port ${env.PORT}`),
);

process.on("uncaughtException", (err) => console.error(err));
process.on("unhandledRejection", (err) => console.error(err));
process.on("exit", () => console.info("Shutting down..."));
