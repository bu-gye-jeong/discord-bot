import { ICommand } from "../index"
import { Prefix } from "../entity/Prefix"
import { getConnection } from "typeorm"

export default <ICommand>{
  name: ["prefix"],
  execute: async function (_client, msg, args): Promise<boolean> {
    if (!args[0]) return false
    if (args[0] == "") return false
    let id = msg.guild?.id
    if (!id) return false

    let prefix = new Prefix()
    prefix.id = id
    prefix.prefix = args.join(" ").trim()

    await getConnection().manager.save(prefix)

    console.log("prefix :", prefix.prefix)
    msg.channel.send("prefix was changed to " + prefix.prefix)
    return true
  },
  usage: "prefix <prefix>",
}
