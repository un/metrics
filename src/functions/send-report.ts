import { EmbedBuilder } from "@discordjs/builders";
import type { Snapshot } from "../utils";
import { Resource } from "sst";

const formatMetrics = (now: number, old?: number) =>
  `${now} (**${now >= (old || 0) ? "+" : "-"}${now - (old || 0)}** vs Yesterday)`;

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
            name: "Accounts",
            value: formatMetrics(newSnapshot.totalAccounts, lastSnapshot?.totalAccounts),
            inline: true,
          },
          {
            name: "Convos",
            value: formatMetrics(newSnapshot.totalConvos, lastSnapshot?.totalConvos),
            inline: true,
          },
          {
            name: "Convo Entires",
            value: formatMetrics(newSnapshot.totalConvoEntires, lastSnapshot?.totalConvoEntires),
            inline: true,
          },
          {
            name: "Convo Attachments",
            value: formatMetrics(
              newSnapshot.totalConvoAttachments,
              lastSnapshot?.totalConvoAttachments,
            ),
            inline: true,
          },
          {
            name: "Orgs",
            value: formatMetrics(newSnapshot.totalOrgs, lastSnapshot?.totalOrgs),
            inline: true,
          },
          {
            name: "Org Members",
            value: formatMetrics(newSnapshot.totalOrgMembers, lastSnapshot?.totalOrgMembers),
            inline: true,
          },
          {
            name: "Teams",
            value: formatMetrics(newSnapshot.totalTeams, lastSnapshot?.totalTeams),
            inline: true,
          },
          {
            name: "Domains",
            value: formatMetrics(newSnapshot.totalDomains, lastSnapshot?.totalDomains),
            inline: true,
          },
          {
            name: "Contacts",
            value: formatMetrics(newSnapshot.totalContacts, lastSnapshot?.totalContacts),
            inline: true,
          },
          {
            name: "Email Identities",
            value: formatMetrics(
              newSnapshot.totalEmailIdentities,
              lastSnapshot?.totalEmailIdentities,
            ),
            inline: true,
          },
          {
            name: "Paying Orgs",
            value: formatMetrics(newSnapshot.totalPayingOrgs, lastSnapshot?.totalPayingOrgs),
            inline: true,
          },
          {
            name: "Paying Members",
            value: formatMetrics(newSnapshot.totalPayingMembers, lastSnapshot?.totalPayingMembers),
            inline: true,
          },
          {
            name: "Github Contributors",
            value: formatMetrics(
              newSnapshot.totalGithubContributors,
              lastSnapshot?.totalGithubContributors,
            ),
            inline: true,
          },
          {
            name: "Github Stars",
            value: formatMetrics(newSnapshot.totalGithubStars, lastSnapshot?.totalGithubStars),
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

  await fetch(Resource.DiscordWebhookUrl.value, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  }).catch(console.error);
}

export async function sendCrashReport(error: string) {
  const message = {
    content: null,
    embeds: [
      {
        title: "Daily Metrics Report encountered an error",
        description: `Error: ${error}`,
        color: 3333923,
      },
    ],
    username: "UnMetrics",
    avatar_url:
      "https://cdn.discordapp.com/icons/1113119653246545961/5c9be16d31e034a1531bfa195a986c2f.webp",
    attachments: [],
  };
  await fetch(Resource.DiscordWebhookUrl.value, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  }).catch(console.error);
}
