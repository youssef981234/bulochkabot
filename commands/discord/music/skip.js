const { Command } = require("discord.js-commando");
const { queue } = require("./queueMap");
const { deleteMessage } = require("../../../utils/deleteMessage");

class SkipCurrentSongCommand extends Command {
  constructor(client) {
    super(client, {
      name: `skip`,
      group: `music`,
      memberName: `skip`,
      description: `Skip a current song.`,
      examples: [`skip`]
    });
  }

  async run(message) {
    let fetched = queue.get(message.guild.id);

    if (!fetched) {
      return message.channel
        .send(`В настоящее время в данной гильдии не играет какая-либо музыка.`)
        .then(msg => {
          msg.delete(4500);
        });
    }
    if (message.member.voiceChannel !== message.guild.me.voiceChannel) {
      return message.channel
        .send(`Извините, но вы находитесь в другом голосовом чате.`)
        .then(msg => {
          msg.delete(5500);
        });
    }

    let userCountInVoiceChannel = message.member.voiceChannel.members.size;
    let requiredVotesToSkip = Math.ceil(userCountInVoiceChannel / 2);

    if (!fetched.queue[0].votesToSkip) {
      fetched.queue[0].votesToSkip = [];
    }

    if (fetched.queue[0].votesToSkip.includes(message.member.id)) {
      return message.channel
        .send(
          `Извините, вы уже проголосовали за пропуск песни! Голосов: ${
            fetched.queue[0].votesToSkip.length
          }/${requiredVotesToSkip} необходимо.`
        )
        .then(msg => {
          msg.delete(7500);
        });
    }
    fetched.queue[0].votesToSkip.push(message.member.id);

    queue.set(message.guild.id, fetched);

    if (fetched.queue[0].votesToSkip.length >= requiredVotesToSkip) {
      await fetched.dispatcher.emit("end");
      deleteMessage(message, message.id);
      return message.channel.send(`Песня пропущена!`).then(msg => {
        msg.delete(3500);
      });
    }
    message.channel
      .send(
        `Ваш голос учтен! Голосов: ${
          fetched.queue[0].votesToSkip.length
        }/${requiredVotesToSkip} необходимо.`
      )
      .then(msg => {
        msg.delete(7500);
      });
  }
}

module.exports = SkipCurrentSongCommand;
