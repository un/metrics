/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "un-metrics",
      removal: input?.stage === "prod" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const discordWebhookUrl = new sst.Secret("DiscordWebhookUrl");
    const planetScaleDbUrl = new sst.Secret("PlanetScaleDbUri");
    const postgresUri = new sst.Secret("PostgresUri");
    const discordApplicationId = new sst.Secret("DiscordApplicationId");
    const discordPublicKey = new sst.Secret("DiscordPublicKey");

    new sst.aws.Cron("DailyReport", {
      schedule: "cron(0 1 * * ? *)",
      job: {
        handler: "src/lambda.cron",
        link: [discordWebhookUrl, planetScaleDbUrl, postgresUri],
      },
    });

    const snapshotApi = new sst.aws.Function("SnapshotApi", {
      handler: "src/lambda.handler",
      url: true,
      link: [
        discordWebhookUrl,
        planetScaleDbUrl,
        postgresUri,
        discordApplicationId,
        discordPublicKey,
      ],
    });

    return {
      url: snapshotApi.url,
    };
  },
});
