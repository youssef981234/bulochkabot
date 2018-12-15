try {
  config = require("./config.json");
} catch (err) {
  console.log("Config file is not found.");
}

/**
 * General constants
 * prefix
 *
 *
 */

module.exports.prefix = "!";

/**
 *
 * Twitch constants
 * token, username, clientID, channel, channelID
 *
 *
 */

module.exports.token = process.env.TWITCH_OAUTH || config.twitch.OAUTH;
module.exports.username = process.env.TWITCH_USERNAME || config.twitch.USERNAME;
module.exports.clientId =
  process.env.TWITCH_CLIENT_ID || config.twitch.client.ID;
module.exports.channel = "maybeagoodman";
module.exports.channelId = 90496824;

/**
 *
 * Discord constants
 * token, clientID, clientSecret
 *
 *
 */

module.exports.discordToken = process.env.DISCORD_TOKEN || config.discord.token;
module.exports.discordClientId =
  process.env.DISCORD_CLIENT_ID || config.discord.client.ID;
module.exports.discordClientSecret =
  process.env.DISCORD_CLIENT_SECRET || config.discord.client.SECRET;
