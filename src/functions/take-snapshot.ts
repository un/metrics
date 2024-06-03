import { dataClient } from "../db/data-client";
import { snapshots } from "../db/schema";
import { setSnapshot } from "../cache";
import { db } from "../db";

async function getCurrentTotal(table: string) {
  const { rows } = await dataClient.execute(`SELECT id FROM ${table} ORDER BY id DESC LIMIT 0, 1`);
  return Number(rows[0]?.["id"]) ?? 0;
}

async function getTableCounts() {
  const tables = [
    "accounts",
    "convos",
    "convo_entries",
    "convo_attachments",
    "orgs",
    "org_members",
    "teams",
    "domains",
    "contacts",
    "email_identities",
  ] as const;

  const counts = Object.fromEntries(
    await Promise.all(tables.map(async (table) => [table, await getCurrentTotal(table)])),
  ) as Record<(typeof tables)[number], number>;

  return counts;
}

async function getPayingOrgCount() {
  const { rows } = await dataClient.execute(`
    SELECT COUNT(*) as count
    FROM org_billing
    WHERE plan='pro'
  `);
  return Number(rows[0]?.count) ?? 0;
}

async function getPayingMembersCount() {
  const { rows } = await dataClient.execute(`
    SELECT COUNT(*) AS count
    FROM org_billing 
    JOIN org_members ON org_billing.org_id = org_members.org_id
    WHERE org_billing.plan = 'pro'
  `);
  return Number(rows[0]?.count) ?? 0;
}

export async function takeSnapshot() {
  const counts = await getTableCounts();
  const payingOrgs = await getPayingOrgCount();
  const payingMembers = await getPayingMembersCount();
  const [snapshot] = await db
    .insert(snapshots)
    .values({
      totalAccounts: counts.accounts,
      totalConvos: counts.convos,
      totalConvoEntires: counts.convo_entries,
      totalConvoAttachments: counts.convo_attachments,
      totalOrgs: counts.orgs,
      totalOrgMembers: counts.org_members,
      totalTeams: counts.teams,
      totalDomains: counts.domains,
      totalContacts: counts.contacts,
      totalEmailIdentities: counts.email_identities,
      totalPayingOrgs: payingOrgs,
      totalPayingMembers: payingMembers,
    })
    .returning();
  if (!snapshot) throw new Error("Failed to take snapshot");
  setSnapshot(snapshot);
  return snapshot;
}
