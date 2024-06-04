import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

export const snapshots = pgTable("snapshots", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  totalAccounts: integer("total_accounts").notNull(),
  totalConvos: integer("total_convos").notNull(),
  totalConvoEntires: integer("total_convo_entires").notNull(),
  totalConvoAttachments: integer("total_convo_attachments").notNull(),
  totalOrgs: integer("total_orgs").notNull(),
  totalOrgMembers: integer("total_org_members").notNull(),
  totalTeams: integer("total_teams").notNull(),
  totalDomains: integer("total_domains").notNull(),
  totalContacts: integer("total_contacts").notNull(),
  totalEmailIdentities: integer("total_email_identities").notNull(),
  totalPayingOrgs: integer("total_paying_orgs").notNull(),
  totalPayingMembers: integer("total_paying_members").notNull(),
  totalGithubStars: integer("total_github_stars").notNull(),
  totalGithubContributors: integer("total_github_repos").notNull(),
});
