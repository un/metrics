import { Client } from "@planetscale/database";
import { Resource } from "sst";

export const dataClient = new Client({
  url: Resource.PlanetScaleDbUri.value,
});
