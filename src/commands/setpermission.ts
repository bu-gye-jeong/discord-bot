import { ICommand, prisma } from "../index";

export default <ICommand>{
  name: ["setpermission"],
  execute: async function (client, msg, args) {
    const authorLevel =
      (
        await prisma.user.findFirst({
          where: {
            id: msg.author.id,
          },
        })
      )?.permission ?? 0;

    const level = parseInt(args[1]);
    console.log(level);
    if (isNaN(level)) {
      msg.channel.send("Not a number!");
      return true;
    }
    if (level < 0) {
      msg.channel.send("permission level can't be lower than 0!");
      return true;
    }
    if (authorLevel <= level) {
      msg.channel.send("Your permission level must be greater than the level you want");
      return true;
    }
    client.users
      .fetch(args[0])
      .then(async (e) => {
        const user = e;
        const userRepo = await prisma.user.create({ data: { id: user.id, permission: level } });
        userRepo.permission = level;
      })
      .catch(() => msg.channel.send("Cannot find user!"));

    return true;
  },
  usage: "setpermission <id> <level>",
};
