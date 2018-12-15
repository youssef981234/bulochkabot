const { CommandoClient } = require("discord.js-commando");
const TwitchClient = require("twitch-js").default;

const path = require("path");
const {
  token,
  clientId,
  username,
  channel,
  discordToken
} = require("./constants");

/**
 * Twitch Client
 */

const { chat } = new TwitchClient({ token, username, clientId });

chat.on("PRIVMSG", message => {
  chat.say(channel, "/me I'm work!");
});

/**
 * Discord Client
 */

const DiscordClient = new CommandoClient({
  owner: "462675608556797952",
  commandPrefix: `!`,
  disableEveryone: true
});

DiscordClient.registry
  .registerDefaultTypes()
  .registerGroups([
    ["help", "Показать существующие команды"],
    ["music", "Слушать, пропускать музыку в голосовом канале"],
    ["misc", "Различные мелкие комманды"]
  ])
  .registerCommandsIn(path.join(__dirname, "commands/discord"));

/**
 * Connect to Twitch chat and Discord server
 */

chat.connect().then(() => {
  chat.join(channel);
  chat.say(channel, "/me is online B)");
});

DiscordClient.on("ready", () => {
  console.log(`Logged in as ${DiscordClient.user.tag}`);
  DiscordClient.user.setActivity("Twitch", { type: "WATCHING" });
});

DiscordClient.login(discordToken);
