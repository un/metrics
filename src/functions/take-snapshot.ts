import { dataClient } from "../db/data-client";
import { snapshots } from "../db/schema";
import { db } from "../db";
import { z } from "zod";

async function getCurrentTotal(table: string) {
  const { rows } = await dataClient.execute(`SELECT id FROM ${table} ORDER BY id DESC LIMIT 0, 1`);
  return Number(rows[0]?.["id"]) || 0;
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
    SELECT COUNT(*) AS count
    FROM org_billing
    WHERE plan='pro'
  `);
  return Number(rows[0]?.count) || 0;
}

async function getPayingMembersCount() {
  const { rows } = await dataClient.execute(`
    SELECT COUNT(*) AS count
    FROM org_billing 
    JOIN org_members ON org_billing.org_id = org_members.org_id
    WHERE org_billing.plan = 'pro'
  `);
  return Number(rows[0]?.count) || 0;
}

async function getGithubStats() {
  const stargazers = await fetch("https://api.github.com/repos/un/inbox")
    .then((r) => r.json())
    .then((d) =>
      z
        .object({ stargazers_count: z.number() })
        .transform(({ stargazers_count }) => stargazers_count)
        .parse(d),
    );
  const contributors = await fetch("https://api.github.com/repos/un/inbox/contributors")
    .then((r) => r.json())
    .then((d) => z.array(z.unknown()).parse(d).length);
  return { stargazers, contributors };
}

export async function takeSnapshot() {
  const [counts, payingOrgs, payingMembers, githubStats] = await Promise.all([
    getTableCounts(),
    getPayingOrgCount(),
    getPayingMembersCount(),
    getGithubStats(),
  ]);
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
      totalGithubContributors: githubStats.contributors,
      totalGithubStars: githubStats.stargazers,
    })
    .returning();
  if (!snapshot) throw new Error("Failed to take snapshot");
  return snapshot;
}
