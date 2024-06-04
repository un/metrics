import { getSnapshot, shouldTakeSnapshot } from "./cache";
import { takeSnapshot } from "./functions/take-snapshot";
import { sendReport } from "./functions/send-report";
import { CronJob } from "cron";

export const snapshotJob = new CronJob("0 1 * * *", async () => {
  const lastSnapshot = await getSnapshot();
  if (lastSnapshot && !shouldTakeSnapshot(lastSnapshot)) {
    console.error("Snapshot already taken today");
  } else {
    const newSnapshot = await takeSnapshot();
    await sendReport(newSnapshot, lastSnapshot);
  }
});
