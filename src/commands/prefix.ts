import { ICommand, prisma } from "../index";

export default <ICommand>{
  name: ["prefix"],
  execute: async function (_client, msg, args): Promise<boolean> {
    if (!args[0]) return false;
    if (args[0] == "") return false;
    let id = msg.guild?.id;
    if (!id) return false;

    let prefix = await prisma.prefix.create({
      data: {
        id: id,
        prefix: args.join(" ").trim(),
      },
    });

    console.log("prefix :", prefix.prefix);
    msg.channel.send("prefix was changed to " + prefix.prefix);
    return true;
  },
  usage: "prefix <prefix>",
};
