import { triggerCommand } from "./src/functions/trigger";
import "dotenv/config";

const applicationId = process.env.DiscordApplicationId;

if (!applicationId) {
  console.error("Missing DiscordApplicationId in .env");
  process.exit(1);
}

const args = process.argv.slice(2);
const [token, guildId] = args;

if (!token || !guildId) {
  console.error("Missing arguments");
  console.error("Usage: tsx register.ts <token> <guildId>");
  process.exit(1);
}

const url = `https://discord.com/api/v10/applications/${applicationId}/guilds/${guildId}/commands`;

const response = await fetch(url, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bot ${token}`,
  },
  method: "PUT",
  body: JSON.stringify([triggerCommand]),
});

if (response.ok) {
  console.log("Registered all commands");
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
} else {
  console.error("Error registering commands");
  let errorText = `Error registering commands \n ${response.url}: ${response.status} ${response.statusText}`;
  try {
    const error = await response.text();
    if (error) {
      errorText = `${errorText} \n\n ${error}`;
    }
  } catch (err) {
    console.error("Error reading body from request:", err);
  }
  console.error(errorText);
}
