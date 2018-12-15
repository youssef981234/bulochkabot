const { Command } = require("discord.js-commando");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const cyrillicToTranslit = require("cyrillic-to-translit-js");
const { RichEmbed } = require("discord.js");
const { queue } = require("./queueMap");
const { deleteMessage } = require("../../../utils/deleteMessage");
const { timeToReadableFormat } = require("../../../utils/timeToReadableFormat");

class PlayMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: `play`,
      group: `music`,
      memberName: `play`,
      description: `Play music in voice channel.`,
      examples: [`play <url>`]
    });
  }

  async end(client, queue, dispatcher) {
    let fetched = queue.get(dispatcher.guildID);
    if (fetched === undefined) {
      return;
    }
    fetched.queue.shift();

    if (fetched.queue.length > 0) {
      queue.set(dispatcher.guildID, fetched);
      this.play(client, queue, fetched);
    } else {
      queue.delete(dispatcher.guildID);

      let voiceChannel = client.guilds.get(dispatcher.guildID).me.voiceChannel;

      if (voiceChannel) voiceChannel.leave();
      this.client.user.setActivity("Twitch", { type: "WATCHING" });
    }
  }

  async play(client, queue, data) {
    const currentPlayingSong = new RichEmbed()
      .setTitle(`🎶 ${data.queue[0].songTitle}`)
      .setURL(data.queue[0].url)
      .addField(`Время`, `${timeToReadableFormat(data.queue[0].timeInSeconds)}`)
      .addField(
        `Просмотров`,
        `${parseInt(data.queue[0].views).toLocaleString()}`
      )
      .setColor(`#1976d2`)
      .setTimestamp(new Date())
      .setImage(data.queue[0].image)
      .setFooter(`Поставил: ${data.queue[0].requester}`);

    client.channels
      .get(data.queue[0].announceChannel)
      .send(currentPlayingSong)
      .then(msg => {
        msg.delete(data.queue[0].timeInSeconds * 1010);
      });

    data.dispatcher = await data.connection.playStream(
      ytdl(data.queue[0].url, { filter: "audioonly" })
    );

    data.dispatcher.guildID = data.guildID;

    client.user.setActivity(`${data.queue[0].songTitle}`, {
      type: "LISTENING"
    });

    data.dispatcher.once("end", () => {
      this.end(client, queue, data);
    });
  }

  async run(message, link) {
    if (!message.member.voiceChannel) {
      deleteMessage(message, message.id);
      return message.channel
        .send(`Пожалуйста, подключитесь к голосовому каналу!`)
        .then(msg => {
          msg.delete(10000);
        });
    }

    if (!link) {
      deleteMessage(message, message.id);
      return message.channel
        .send(`Пожалуйста, введите **URL-адрес** или **название песни**!`)
        .then(msg => {
          msg.delete(10000);
        });
    }
    let validate = await ytdl.validateURL(link);

    // Если предоставлена не ссылка, ищет видео по названию
    // и потом заново запускает метод run() с найденой ссылкой
    if (!validate) {
      // yt-search не поддерживает кирилицу, поэтому конвертируем кирилицу в транслит
      link = cyrillicToTranslit().transform(link.toLowerCase());
      ytSearch(link, (err, res) => {
        if (err) {
          return message.channel
            .send(`Простите, но кажется что-то пошло не так!`)
            .then(msg => {
              msg.delete(13000);
            });
        }
        message.channel.send(`Поиск...`).then(msg => {
          msg.delete(6000);
        });

        let videos = res.videos.slice(0, 1);

        this.run(message, `https://www.youtube.com${videos[0].url}`);
      });
    } else {
      let info = await ytdl.getInfo(link);

      let data = queue.get(message.guild.id) || {};

      if (!data.connection)
        data.connection = await message.member.voiceChannel.join();

      if (!data.queue) data.queue = [];

      data.guildID = message.guild.id;
      data.queue.push({
        songTitle: info.title,
        // Берем последнюю thumbnail в массиве thumbnails
        image:
          info.player_response.videoDetails.thumbnail.thumbnails[
            info.player_response.videoDetails.thumbnail.thumbnails.length - 1
          ].url,
        timeInSeconds: info.player_response.videoDetails.lengthSeconds,
        views: info.player_response.videoDetails.viewCount,
        requester: message.author.tag,
        url: link,
        announceChannel: message.channel.id
      });
      deleteMessage(message, message.id);
      if (!data.dispatcher) this.play(this.client, queue, data);
      else {
        const songToQueue = new RichEmbed()
          .setTitle(
            `Добавлено в очередь: **${info.title}** | Поставил: *${
              message.author.tag
            }*`
          )
          .setTimestamp(new Date())
          .setColor(`#1976d2`);
        message.channel.send(songToQueue).then(msg => {
          msg.delete(11200);
        });
      }
      queue.set(message.guild.id, data);
    }
  }
}

module.exports = PlayMusicCommand;
