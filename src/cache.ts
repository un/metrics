import LRU from "unstorage/drivers/lru-cache";
import { createStorage } from "unstorage";
import { snapshots } from "./db/schema";
import { isSameDay } from "date-fns";
import { desc } from "drizzle-orm";
import { ms } from "itty-time";
import { db } from "./db";

export type Snapshot = typeof snapshots.$inferSelect;

const storage = createStorage<Snapshot>({
  driver: LRU({ allowStale: false, ttl: ms("1 day"), updateAgeOnGet: true }),
});

export const getSnapshot = async () => {
  const cached = await storage.getItem("snapshot");
  if (cached) return cached;
  const snapshot = await db.query.snapshots.findFirst({ orderBy: desc(snapshots.timestamp) });
  if (snapshot) {
    setSnapshot(snapshot);
    return snapshot;
  }
  return null;
};
export const setSnapshot = (snapshot: Snapshot) => storage.setItem("snapshot", snapshot);
export const clearSnapshot = () => storage.removeItem("snapshot");

export const shouldTakeSnapshot = (snapshot: Snapshot) =>
  !isSameDay(new Date(snapshot.timestamp), new Date());
