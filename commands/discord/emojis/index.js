const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");

class GetEmojiesCommand extends Command {
  constructor(client) {
    super(client, {
      name: "emojis",
      memberName: "emojis",
      group: "misc",
      description: "Получить все эмоджи на сервере.",
      examples: ["!emojis"]
    });
  }

  async run(message) {
    const emojiList = message.guild.emojis
      .map(emoji => `${emoji} --> **:${emoji.name}:**`)
      .join("\n");

    const emojiEmbed = new RichEmbed()
      .setTitle(`Список текущих эмоджи`)
      .setDescription(emojiList)
      .setColor("#5e35b1")
      .setThumbnail(message.guild.iconURL)
      .setTimestamp(new Date());

    return await message.channel.send(emojiEmbed);
  }
}

module.exports = GetEmojiesCommand;
