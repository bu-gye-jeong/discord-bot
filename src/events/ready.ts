import Discord from "discord.js"

export default (client: Discord.Client) => {
  console.log(`Logged in as ${client?.user?.tag}!`)
}
