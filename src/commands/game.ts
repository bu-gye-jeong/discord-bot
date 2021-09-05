import { ICommand } from "../index"
import { games } from "../index"
import config from "../../config.json"

export default <ICommand>{
  name: ["game", "놀이", "게임"],
  execute: async function (client, msg, args) {
    const gameName = args.shift()?.toLowerCase()!
    const gameArgs = args
    const game = games.find((_, k) => k.includes(gameName))

    if (!game) return

    if (game.permissionLevel == 1 && !config.admin.includes(msg.author.id)) {
      msg.channel.send("You dont have permission to execute this command!")
      return
    }

    if (!(await game.execute(client, msg, gameArgs))) msg.channel.send(`usage : ${game.usage ?? game.name}`)

    return true
  },
  usage: "game|놀이|게임 <game> \n 게임 종류는 help",
}
