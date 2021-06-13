import Discord from "discord.js"
import config from "../config.json"
import { promisify } from "util"
import fs from "fs"
import path from "path"
import { createConnection } from "typeorm"

const client = new Discord.Client()
const readdir = promisify(fs.readdir)
const dev = process.env.NODE_ENV === "dev"
const commands: Discord.Collection<string[], ICommand> = new Discord.Collection()
const games: Discord.Collection<string[], ICommand> = new Discord.Collection()

export interface ICommand {
  execute(client: Discord.Client, msg: Discord.Message, args: string[]): boolean | Promise<boolean>
  name: string[]
  permissionLevel?: number
  usage?: string
}

export interface IGame {
  execute(client: Discord.Client, msg: Discord.Message, args: string[]): boolean | Promise<boolean>
  name: string[]
  permissionLevel?: number
  usage?: string
}

console.log(dev)

const init = async () => {
  process.on("SIGINT", async () => {
    console.log("")
    console.warn("SIGINT Detected! I'll safely terminate the process..")
    client.destroy()
    process.exit(0)
  })

  const connection = await createConnection()
  if (connection) await connection.synchronize()

  const eventFiles = (await readdir(path.join(__dirname, "/events"))).filter((f) => f.endsWith(dev ? ".ts" : ".js"))
  console.log("Loading event files...")

  for (const file of eventFiles) {
    console.log(`Attempting to loading event ${file}`)
    let event: Function = require(`./events/${file}`).default
    client.on(file.split(".")[0], event.bind(null, client))
  }

  const cmdFiles = (await readdir(path.join(__dirname, "/commands"))).filter((f) => f.endsWith(dev ? ".ts" : ".js"))
  console.log("Loading command files...")

  for (const file of cmdFiles) {
    console.log(`Attempting to loading command ${file}`)
    const command: ICommand = require(`./commands/${file}`).default
    if (!command) {
      console.log("command is not set!")
      continue
    }
    commands.set(command.name, command)
  }

  const gameFiles = (await readdir(path.join(__dirname, "/games"))).filter((f) => f.endsWith(dev ? ".ts" : ".js"))
  console.log("Loading game files...")

  for (const file of gameFiles) {
    console.log(`Attempting to loading game ${file}`)
    const game: IGame = require(`./games/${file}`).default
    if (!game) {
      console.log("game is not set!")
      continue
    }
    games.set(game.name, game)
  }

  await client.login(config.token)
}

init()

export { commands, games }
