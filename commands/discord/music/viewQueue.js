const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");

const { queue } = require("./queueMap");

class ViewQueueCommand extends Command {
  constructor(client) {
    super(client, {
      name: `queue`,
      group: `music`,
      description: `View current queue`,
      memberName: `queue`,
      examples: [`queue`]
    });
  }

  async run(message) {
    let fetched = queue.get(message.guild.id);

    if (!fetched)
      return message.channel.send(
        `В настоящее время в данной гильдии не играет какая-либо музыка.`
      );

    let viewQueue = fetched.queue;
    let nowPlaying = viewQueue[0];

    let msg = `Сейчас играет: **${nowPlaying.songTitle}** | Поставил: **${
      nowPlaying.requester
    }**\n\n`;

    for (let i = 1; i < viewQueue.length; i++) {
      const element = `**${i}**: \`${viewQueue[i].songTitle}\` | Поставил: *${
        viewQueue[i].requester
      }*\n`;
      msg += element;
    }

    const queueView = new RichEmbed()
      .setTitle("**Список песен в очереди:**")
      .setTimestamp(new Date())
      .setColor(`#1976d2`)
      .setDescription(msg);

    message.channel.send(queueView);
  }
}

module.exports = ViewQueueCommand;
