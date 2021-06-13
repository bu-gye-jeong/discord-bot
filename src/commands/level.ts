import { ICommand } from "../index"
import { User } from "../entity/User"
import { getConnection } from "typeorm"

export default <ICommand>{
  name: ["level"],
  execute: async function (client, msg, args): Promise<boolean> {
    if (args.length <= 1) return false

    const connection = getConnection()

    const tag = args[1].match(new RegExp(/^.+#[0-9]{4}$/g))
    if (!tag) return false
    const id = client.users.cache.find((u) => u.tag === tag[0])?.id
    if (!id) return false
    const userRepository = connection.getRepository(User)
    let user: User | undefined

    switch (args[0]) {
      case "set":
        if (args.length <= 2) return false
        if (!Number.isInteger(Number(args[2]))) return false

        user = new User()
        user.id = id
        user.level = Number(args[2])
        await connection.manager.save(user)

        console.log(`set ${args[1]}'s level to ${args[2]}`)
        msg.channel.send(`successfully set ${args[1]}'s level to ${args[2]}`)
        return true

      case "get":
        user = await userRepository.findOne({ id: id })
        let level = user?.level
        if (!user) level = 1

        msg.channel.send(`Level : ${level}`)
        return true

      default:
        return false
    }
  },
  permissionLevel: 0,
  usage: "level {set <user> <value>} or {get <user>}",
}
