import type { Snapshot } from "../cache";
import { env } from "../env";

const formatMetrics = (now: number, old?: number) =>
  `${now} (**${now > (old ?? 0) ? "+" : "-"}${now - (old ?? 0)}** vs Yesterday)`;

export async function sendReport(newSnapshot: Snapshot, lastSnapshot: Snapshot | null) {
  const message = {
    content: null,
    embeds: [
      {
        title: "Daily Metrics Report",
        description: `New Snapshot (#${newSnapshot.id}) is taken at <t:${Math.ceil(new Date(newSnapshot.timestamp).getTime() / 1000)}>`,
        color: 3333923,
        fields: [
          {
            name: "Total Accounts",
            value: formatMetrics(newSnapshot.totalAccounts, lastSnapshot?.totalAccounts),
            inline: true,
          },
          {
            name: "Total Convos",
            value: formatMetrics(newSnapshot.totalConvos, lastSnapshot?.totalConvos),
            inline: true,
          },
          {
            name: "Total Convo Entires",
            value: formatMetrics(newSnapshot.totalConvoEntires, lastSnapshot?.totalConvoEntires),
            inline: true,
          },
          {
            name: "Total Convo Attachments",
            value: formatMetrics(
              newSnapshot.totalConvoAttachments,
              lastSnapshot?.totalConvoAttachments,
            ),
            inline: true,
          },
          {
            name: "Total Orgs",
            value: formatMetrics(newSnapshot.totalOrgs, lastSnapshot?.totalOrgs),
            inline: true,
          },
          {
            name: "Total Org Members",
            value: formatMetrics(newSnapshot.totalOrgMembers, lastSnapshot?.totalOrgMembers),
            inline: true,
          },
          {
            name: "Total Teams",
            value: formatMetrics(newSnapshot.totalTeams, lastSnapshot?.totalTeams),
            inline: true,
          },
          {
            name: "Total Domains",
            value: formatMetrics(newSnapshot.totalDomains, lastSnapshot?.totalDomains),
            inline: true,
          },
          {
            name: "Total Contacts",
            value: formatMetrics(newSnapshot.totalContacts, lastSnapshot?.totalContacts),
            inline: true,
          },
          {
            name: "Total Email Identities",
            value: formatMetrics(
              newSnapshot.totalEmailIdentities,
              lastSnapshot?.totalEmailIdentities,
            ),
            inline: true,
          },
          {
            name: "Total Paying Orgs",
            value: formatMetrics(newSnapshot.totalPayingOrgs, lastSnapshot?.totalPayingOrgs),
            inline: true,
          },
          {
            name: "Total Paying Members",
            value: formatMetrics(newSnapshot.totalPayingMembers, lastSnapshot?.totalPayingMembers),
            inline: true,
          },
        ],
      },
    ],
    username: "UnMetrics",
    avatar_url:
      "https://cdn.discordapp.com/icons/1113119653246545961/5c9be16d31e034a1531bfa195a986c2f.webp",
    attachments: [],
  };

  await fetch(env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  }).catch(console.error);
}
