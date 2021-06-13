import { ICommand } from "../index"
import fs from "fs"

export default <ICommand>{
  name: ["eval"],
  execute: async function (_client, msg, args) {
    if (args.length == 0) return false
    try {
      const result: string = eval(args.join(" "))

      if (!result) {
        await msg.channel.send("```" + result + "```")
      } else if (result.length >= 2000 - 6) {
        const filePath = "./temp.txt"

        fs.writeFileSync(filePath, result)
        await msg.channel.send("", { files: ["./temp.txt"] })
        fs.unlinkSync(filePath)
      } else await msg.channel.send("```" + result + "```")
    } catch (err) {
      await msg.channel.send("```" + err + "```")
    }
    return true
  },
  permissionLevel: 1,
  usage: "eval <string>",
}
