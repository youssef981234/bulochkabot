const { Command } = require("discord.js-commando");
const { queue } = require("./queueMap");

class ChangeVolumeCommand extends Command {
  constructor(client) {
    super(client, {
      name: `volume`,
      group: `music`,
      memberName: `volume`,
      description: `Change volume of the current song.`,
      examples: [`volume 100`]
    });
  }

  async run(message) {
    let args = message.content.substr(7);

    let fetched = queue.get(message.guild.id);

    if (!fetched) {
      return message.channel
        .send(`В настоящее время в данной гильдии не играет какая-либо музыка.`)
        .then(msg => {
          msg.delete(10000);
        });
    }
    if (message.member.voiceChannel !== message.guild.me.voiceChannel) {
      return message.channel
        .send(`Извините, но вы находитесь в другом голосовом канале.`)
        .then(msg => {
          msg.delete(10000);
        });
    }

    if (isNaN(args) || args > 200 || args < 0) {
      return message.channel
        .send(`Пожалуйста, введите число между 0 - 200!`)
        .then(msg => {
          msg.delete(20000);
        });
    }

    await fetched.dispatcher.setVolume(args / 100);

    message.channel
      .send(
        `Успешно изменена громкость песни: ${
          fetched.queue[0].songTitle
        } на **${args}**`
      )
      .then(msg => {
        msg.delete(35000);
      });
  }
}

module.exports = ChangeVolumeCommand;
