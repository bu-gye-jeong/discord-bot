import { ICommand } from "../index"

export default <ICommand>{
  name: ["안녕"],
  execute: function (_client, msg, _args) {
    msg.channel.send("안녕!")
    return true
  },
}
