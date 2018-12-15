const ytdl = require("ytdl-core");
const { queue } = require("../../discord/music/queueMap");

const { channel } = require("../../../constants");

const end = async (client, queue, dispatcher) => {
  let fetched = queue.get(dispatcher.guildID);
  if (fetched === undefined) {
    return;
  }
  fetched.queue.shift();

  if (fetched.queue.length > 0) {
    queue.set(dispatcher.guildID, fetched);
    play(client, queue, fetched);
  } else {
    queue.delete(dispatcher.guildID);

    let voiceChannel = client.guilds.get(dispatcher.guildID).me.voiceChannel;

    if (voiceChannel) voiceChannel.leave();
    client.user.setActivity("Twitch", { type: "WATCHING" });
  }
};

const play = async (client, queue, data) => {
  data.dispatcher = await data.connection.playStream(
    ytdl(data.queue[0].url, { filter: "audioonly" })
  );

  data.dispatcher.guildID = data.guildID;

  client.user.setActivity(`${data.queue[0].songTitle}`, {
    type: "LISTENING"
  });

  data.dispatcher.once("end", () => {
    end(client, queue, data);
  });
};

module.exports.request = async (client, args, user, chat) => {
  const guild = client.guilds.get("500554530614935573");
  const guildID = guild.id;
  const voiceChannel = guild.channels.get("522136010616864779");

  let validate = await ytdl.validateURL(args);
  console.log(args);

  if (!validate) {
    chat.say(channel, "Введите действительный URL-адрес!");
  } else {
    let info = await ytdl.getInfo(args);

    let data = queue.get(guildID) || {};

    if (!data.connection) data.connection = await voiceChannel.join();

    if (!data.queue) data.queue = [];

    data.guildID = guildID;

    data.queue.push({
      songTitle: info.title,
      timeInSeconds: info.player_response.videoDetails.lengthSeconds,
      requester: user,
      url: args,
      type: "Twitch"
    });

    if (!data.dispatcher) play(client, queue, data, chat);
    else {
      chat.say(
        channel,
        `Добавлено в очередь: ${info.title} | Поставил: ${user}`
      );
    }
    queue.set(guildID, data);
  }
};
