import { getSnapshot, respond, shouldTakeSnapshot, verifyDiscordRequest } from "./utils";
import { sendCrashReport, sendReport } from "./functions/send-report";
import { takeSnapshot } from "./functions/take-snapshot";
import type { LambdaFunctionURLEvent } from "aws-lambda";
import { InteractionType } from "discord-interactions";
import { triggerCommand } from "./functions/trigger";
import { allowedUsers } from "./config";

async function handleSnapshot(force = false) {
  const lastSnapshot = await getSnapshot();
  if (force || (lastSnapshot && shouldTakeSnapshot(lastSnapshot)) || !lastSnapshot) {
    const newSnapshot = await takeSnapshot();
    await sendReport(newSnapshot, lastSnapshot);
    return true;
  } else {
    return false;
  }
}

export async function cron() {
  try {
    await handleSnapshot();
  } catch (e) {
    sendCrashReport(`${(e as Error).message}`);
  }
}

export async function handler(evt: LambdaFunctionURLEvent) {
  if (evt.requestContext.http.method !== "POST") return respond("Method not allowed");
  const headers = evt.headers;
  const body = evt.body;
  const { interaction, isValid } = await verifyDiscordRequest(headers, body || "");
  if (!isValid) {
    return { statusCode: 401, body };
  }
  if (interaction.type === InteractionType.PING) {
    return { statusCode: 200, body };
  }
  if (
    interaction.type === InteractionType.APPLICATION_COMMAND &&
    interaction.data.name === triggerCommand.name
  ) {
    const userId = interaction.member?.user.id;
    if (!userId || !allowedUsers.includes(userId)) {
      return respond("You are not allowed to use this command");
    }
    const force = interaction.data.options?.find((option: any) => option.name === "force")?.value;
    const snapshotTaken = await handleSnapshot(force);
    if (snapshotTaken) {
      return respond("Snapshot Taken");
    } else {
      return respond("Snapshot already taken today");
    }
  } else {
    return respond("Unknown command");
  }
}
