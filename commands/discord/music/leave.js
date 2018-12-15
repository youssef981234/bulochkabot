const { Command } = require("discord.js-commando");
const { queue } = require("./queueMap");

class LeaveVoiceChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: `leave`,
      group: `music`,
      memberName: `leave`,
      description: `Leave from voice channel.`,
      examples: [`leave`]
    });
  }

  async run(message) {
    if (!message.member.voiceChannel)
      return message.channel
        .send(`Пожалуйста, подключитесь к голосовому каналу!`)
        .then(msg => {
          msg.delete(30000);
        });

    if (!message.guild.me.voiceChannel)
      return message.channel
        .send(`Sorry, the bot isn\'t connected to the guild`)
        .then(msg => {
          msg.delete(30000);
        });

    if (message.guild.me.voiceChannelID !== message.member.voiceChannelID)
      return message.channel
        .send(`Sorry, you aren\'t connected to the same channels`)
        .then(msg => {
          msg.delete(30000);
        });

    let voiceChannel = this.client.guilds.get(message.guild.id).me.voiceChannel;

    queue.delete(message.guild.id);

    if (voiceChannel) voiceChannel.leave();
    this.client.user.setActivity("Twitch", { type: "WATCHING" });

    return await message.channel
      .send(`_Ухожу дальше смотреть твитч..._`)
      .then(msg => {
        msg.delete(70000);
      });
  }
}

module.exports = LeaveVoiceChannelCommand;
