/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    AuthSecret: {
      type: "sst.sst.Secret"
      value: string
    }
    DiscordApplicationId: {
      type: "sst.sst.Secret"
      value: string
    }
    DiscordPublicKey: {
      type: "sst.sst.Secret"
      value: string
    }
    DiscordWebhookUrl: {
      type: "sst.sst.Secret"
      value: string
    }
    PlanetScaleDbUri: {
      type: "sst.sst.Secret"
      value: string
    }
    PostgresUri: {
      type: "sst.sst.Secret"
      value: string
    }
    SnapshotApi: {
      name: string
      type: "sst.aws.Function"
      url: string
    }
  }
}
export {}