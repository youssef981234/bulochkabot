const { CommandoClient } = require("discord.js-commando");
const TwitchClient = require("twitch-js").default;

const countdown = require("countdown");
countdown.resetLabels();
countdown.setLabels(
  " миллисекунд| сек| мин| час| день| неделя| месяц| год| десятилетие| век| тысячелетие",
  " миллисекунды| сек| мин| часов| дней| недель| месяцов| лет| десятилетий| веков| тысячелетий",
  " ",
  " "
);

const path = require("path");
const {
  token,
  clientId,
  username,
  channel,
  channelId,
  discordToken,
  prefix,
  eightBallAnswers
} = require("./constants");

/**
 * Twitch Client
 *
 */

const { chat, api } = new TwitchClient({ token, username, clientId });

chat.on("PRIVMSG", content => {
  const message = content.message;
  const user = content.username;
  const userId = content.tags.userId;

  const isModerator = "1" === content.tags.mod;
  const isSubscriber = "1" === content.tags.subscriber;
  const isBroadcaster = content.tags.badges.broadcaster;

  const isCommand = message.startsWith(prefix);

  if (isCommand) {
    const command = message
      .substr(1)
      .split(" ")
      .shift();

    switch (command) {
      case "help":
        chat.say(
          channel,
          `@${user}, Доступные команды: !time !followage !vk !discord !8ball <вопрос>`
        );
        break;
      case "vk":
        chat.say(
          channel,
          `@${user}, Группа ВК: https://vk.com/public171412364`
        );
        break;
      case "discord":
        chat.say(
          channel,
          `@${user}, Сервер Discord: https://discordapp.com/invite/gGk4Hge`
        );
        break;

      case "8ball":
        const len = eightBallAnswers.length - 1;
        const randomAnswer = eightBallAnswers[Math.round(Math.random() * len)];
        chat.say(channel, `@${user}, ${randomAnswer}`);
        break;

      case "time":
        api
          .get(`streams/${channelId}`)
          .then(response => {
            if (response.stream === null) {
              chat.say(channel, `${channel} оффлайн. :(`);
              return;
            }

            const timestamp = new Date(response.stream.created_at).getTime();
            const uptime = countdown(timestamp, Date.now(), 158);
            const game = response.stream.game;

            chat.say(
              channel,
              `Стрим идет уже: ${uptime}. Игра на стриме: ${game}`
            );
          })
          .catch(err => {
            console.error(err);
            if (err.body.status !== 200) {
              chat.say(channel, "User not found");
              return;
            }
            chat.say(channel, "Errror");
          });
        break;

      case "followage":
        api
          .get(`users/${userId}/follows/channels/${channelId}`)
          .then(response => {
            const followAge = response.createdAt;

            const timestamp = new Date(followAge).getTime();
            const followAgeStr = countdown(timestamp, Date.now(), 158);

            chat.say(channel, `@${user}, Ты с нами уже: ${followAgeStr}`);
          })
          .catch(err => {
            chat.say(
              channel,
              `@${user}, Похоже, что ты ещё не с нами! Ты знаешь, что делать B) Жми follow и наслаждайся стримом!`
            );
          });
        break;
      default:
        chat.say(
          channel,
          `@${user}, Неизвестная команда! Используйте !help чтобы узнать все доступные команды.`
        );
        break;
    }
  }
});

// Cheers
chat.on("PRIVMSG/CHEER", content => {
  const user = content.username;
  const bits = content.bits;
  if (bits === 1) {
    chat.say(channel, `@${user}, Спасибо за ${bits} бит! BloodTrail`);
  } else if (bits > 1 && bits < 100) {
    chat.say(channel, `@${user}, Спасибо за ${bits} битцов! BloodTrail`);
  } else if (bits >= 100 && bits < 1000) {
    chat.say(
      channel,
      `@${user}, Воу воу, полегче! Спасибо за ${bits} битцов! Kreygasm`
    );
  }
});

chat.on("USERNOTICE/RESUBSCRIPTION", content => {
  console.log(content);
  const user = content.username;
  const months = content.parameters.months;
  chat.say(
    channel,
    `@${user}, Спасибо за ${months} месяцев подписки! С возращением, булочка BloodTrail`
  );
});

chat.on("USERNOTICE/SUBSCRIPTION", content => {
  console.log(content);
  const user = content.username;
  chat.say(channel, `@${user}, Добро пожаловать в нашу булочную семью, друг!`);
});

chat.on("USERNOTICE/SUBSCRIPTION_GIFT", content => {
  console.log(content);
});

chat.on("USERNOTICE/SUBSCRIPTION_GIFT_COMMUNITY", content => {
  console.log(content);
});

chat.connect().then(() => {
  chat.join(channel);
  chat.say(channel, "/me is online :)");
});

const sendMessagesAuto = [
  "Если впервые здесь - жми follow. Таким образом ты можешь отследить начало стрима вовремя, а также помочь в развитии канала.",
  "Доступные команды: !time !followage !vk !discord !8ball <вопрос>",
  "Группа ВК: https://vk.com/public171412364",
  "Сервер Discord: https://discordapp.com/invite/gGk4Hge"
];

setInterval(() => {
  const sendMessagesAutoLength = sendMessagesAuto.length - 1;
  chat.say(
    channel,
    sendMessagesAuto[Math.round(Math.random() * sendMessagesAutoLength)]
  );
}, 600000);

/**
 * Discord Client
 *
 */

const DiscordClient = new CommandoClient({
  owner: "462675608556797952",
  commandPrefix: prefix,
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
  api.initialize({
    token: token,
    clientId: clientId
  });
  chat.join(channel);
});

DiscordClient.on("ready", () => {
  console.log(`Logged in as ${DiscordClient.user.tag}`);
  DiscordClient.user.setActivity("Twitch", { type: "WATCHING" });
});

DiscordClient.login(discordToken);
