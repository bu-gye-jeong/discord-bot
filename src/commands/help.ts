import { ICommand } from "../index"
import help from "../../help.json"
import Discord from "discord.js"

export default <ICommand>{
  name: ["help"],
  execute: function (client, msg, args) {
    const helpEmbed = new Discord.MessageEmbed()
      .setColor("#f1c40f")
      .setTitle("부계정봇")
      .setDescription(help.description)
      .setURL(help.invitation)
      .addField("\u200B", "`commands`")

    help.commands.forEach((command) => {
      helpEmbed.addField(
        command.name + (command.alias ? `(${command.alias.join(", ")})` : ""),
        command.description,
        true
      )
    })

    helpEmbed.addField("\u200B", "`games`")

    help.games.forEach((game) => {
      helpEmbed.addField(game.name + (game.alias ? `(${game.alias.join(", ")})` : ""), game.description, true)
    })

    msg.channel.send(helpEmbed)
    return true
  },
}
