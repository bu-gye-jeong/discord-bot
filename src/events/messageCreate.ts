import Discord, { Message } from "discord.js";
import config from "../../config.json";
import { commands, prisma } from "../index";

export default async (client: Discord.Client, msg: Discord.Message) => {
  if (msg.author.bot) return;

  if (config.iL.includes(msg.channel.id)) ReactiL(msg);

  // check prefix
  const guildid = msg.guild?.id;
  let prefix = config.prefix;
  if (guildid) {
    const guild = await prisma.prefix.findFirst({ where: { id: guildid } });
    if (guild?.prefix) prefix = guild?.prefix;
  }
  // if it is a mention, prints prefix
  const id = client.user?.id;
  if (id) {
    if (msg.content.match(new RegExp(`<@!?${id}>`, "g"))) {
      msg.channel.send("current prefix is " + prefix);
      console.log(`${msg.author.tag} used command '${msg.content}'!`);
    }
  }

  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const commandName = args.shift()?.toLowerCase()!;
  const command = commands.find((_, k) => k.includes(commandName));

  if (!command) return;

  const commandPermission = command.permissionLevel ?? 0;

  if (commandPermission != 0) {
    const user = await prisma.user.findFirst({ where: { id: msg.author.id } });
    const permissionLevel = user?.permission ?? 0;
    if (commandPermission > permissionLevel) {
      msg.channel.send("이 명령어를 실행할 권한이 없습니다!");
      return;
    }
  }

  console.log(`${msg.author.tag} used command '${msg.content}'!`);
  if (!(await command.execute(client, msg, args)))
    msg.channel.send(`사용법 : ${command.usage ?? command.name}`);
};

async function ReactiL(msg: Discord.Message) {
  try {
    await msg.react("ℹ️");
    await msg.react("🇱");
  } catch (e) {
    console.log(e);
  }
}
