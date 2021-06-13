import Discord, { Message } from "discord.js"
import config from "../../config.json"
import { commands } from "../index"
import { Prefix } from "../entity/Prefix"
import { getConnection } from "typeorm"

export default async (client: Discord.Client, msg: Discord.Message) => {
  if (msg.author.bot) return

  if (config.iL.includes(msg.channel.id)) ReactiL(msg)

  // check prefix
  const guildid = msg.guild?.id
  if (!guildid) return
  const guild = await getConnection().getRepository(Prefix).findOne({ id: guildid })
  let prefix = guild?.prefix
  if (!prefix) prefix = config.prefix

  // if it is a mention, prints prefix
  const id = client.user?.id
  if (id) {
    if (msg.content.match(new RegExp(`<@!?${id}>`, "g"))) {
      msg.channel.send("current prefix is " + prefix)
      console.log(`${msg.author.tag} used command '${msg.content}'!`)
    }
  }

  if (!msg.content.startsWith(prefix)) return

  const args = msg.content.slice(prefix.length).trim().split(/ +/g)
  const commandName = args.shift()?.toLowerCase()!
  const command = commands.find((_, k) => k.includes(commandName))

  if (!command) return

  if (command.permissionLevel == 1 && !config.admin.includes(msg.author.id)) {
    msg.channel.send("이 명령어를 실행할 권한이 없습니다!")
    return
  }

  console.log(`${msg.author.tag} used command '${msg.content}'!`)
  if (!(await command.execute(client, msg, args))) msg.channel.send(`사용법 : ${command.usage ?? command.name}`)
}

async function ReactiL(msg: Discord.Message) {
  try {
    await msg.react("ℹ️")
    await msg.react("🇱")
  } catch (e) {
    console.log(e)
  }
}
