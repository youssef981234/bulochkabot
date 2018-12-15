const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");

const commands = require("./commands.json");
const { prefix } = require("../../../constants");

class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      group: "help",
      memberName: "help",
      description: "List of all enables commands.",
      examples: ["help"]
    });
  }
  async run(message) {
    const commandsMap = new Map();

    commands.forEach(element => {
      commandsMap.set(element.name, element.body);
    });

    const namesOfCommands = commandsMap.keys();
    let HelpCommandDescription = "";

    for (const command of commandsMap) {
      const name = namesOfCommands.next().value;
      const body = commandsMap.get(name);
      const commands = body.commands;

      HelpCommandDescription += `_**${name}:**_\n`;

      for (const cmd of commands) {
        HelpCommandDescription += `\`${prefix}${cmd}\n`;
      }
      HelpCommandDescription += "\n\n";
    }

    const res = new RichEmbed()
      .setTitle(`**Доступные команды на сервере**`)
      .setColor(`#43A047`)
      .setDescription(HelpCommandDescription)
      .setThumbnail(message.guild.iconURL)
      .setTimestamp(new Date());

    return await message.channel.send(res).then(msg => {
      msg.delete(1200000);
    });
  }
}

module.exports = HelpCommand;
