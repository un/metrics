import { SlashCommandBuilder } from "@discordjs/builders";

export const triggerCommand = new SlashCommandBuilder()
  .setName("metrics_trigger")
  .setDescription("Manually trigger the metrics report")
  .addBooleanOption((option) =>
    option.setName("force").setDescription("Force the report to be sent even if it's not time yet"),
  );
