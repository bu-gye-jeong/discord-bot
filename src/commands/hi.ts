import { ICommand } from "../index"

export default <ICommand>{
  name: ["hi", "하이", "ㅎㅇ", "hello"],
  execute: function (_client, msg, _args) {
    msg.channel.send("hi!")
    return true
  },
}
