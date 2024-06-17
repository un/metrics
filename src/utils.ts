import { InteractionResponseFlags, InteractionResponseType, verifyKey } from "discord-interactions";
import { isSameDay } from "date-fns/isSameDay";
import { snapshots } from "./db/schema";
import { desc } from "drizzle-orm";
import { Resource } from "sst";
import { db } from "./db";

export type Snapshot = typeof snapshots.$inferSelect;

export const getSnapshot = async () =>
  (await db.query.snapshots.findFirst({ orderBy: desc(snapshots.timestamp) })) || null;

export const shouldTakeSnapshot = (snapshot: Snapshot) =>
  !isSameDay(new Date(snapshot.timestamp), new Date());

export const respond = (content: string) =>
  JSON.stringify({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content,
      flags: InteractionResponseFlags.EPHEMERAL,
    },
  });

export async function verifyDiscordRequest(
  headers: Record<string, string | undefined>,
  body: string,
) {
  const signature = headers["x-signature-ed25519"];
  const timestamp = headers["x-signature-timestamp"];
  const isValidRequest =
    signature &&
    timestamp &&
    (await verifyKey(body, signature, timestamp, Resource.DiscordPublicKey.value));
  if (!isValidRequest) {
    return { interaction: JSON.parse(body), isValid: false };
  }
  return { interaction: JSON.parse(body), isValid: true };
}
