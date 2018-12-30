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

module.exports.defaultSettings = {
  requestsMode: false,
  eightBallAnswers = [
    "Нет и точка.",
    "Все возможно Kappa",
    "... ну, и такое бывает KappaPride",
    "Да как ты посмел такое спросить ? DansGame",
    "ну может быть ResidentSleeper",
    "Да, наверно... Keepo",
    "Я не хочу на такое отвечать PunOko",
    "Вопрос, конечно, интереснный, но отвечать я, конечно же, не буду CoolStoryBob",
    "Даже думать не хочу об этом PanicVis",
    "Дайте ему мут, чтобы он не задавал таких вопросов BlessRNG",
    "Мне кажется или ты дурак, раз задаешь такие вопросы? TehePelo",
    "Я бы ответил, но боюсь меня забанят за такое KappaRoss",
    "Да, инфа 100%",
    "Определенно да TPFufun ",
    "Именно так",
    "Ты делаешь мне больно, когда задаешь такие вопросы BibleThump",
    "Вот щас не понял cmonBruh"
  ],
  prefix = "!"
};

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
module.exports.channel = "thatlongcat";
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
module.exports.guildID = "500554530614935573";
