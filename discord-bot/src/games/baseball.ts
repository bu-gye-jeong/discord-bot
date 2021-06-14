import { getConnection, SimpleConsoleLogger } from "typeorm"
import { IGame } from "../index"
import { Baseball } from "../entity/Baseball"

export default <IGame>{
  name: ["야구", "숫자야구"],
  execute: async function (_client, msg, args) {
    const connection = getConnection()
    const baseballRepository = connection.getRepository(Baseball)
    const id = msg.author.id
    let user = await baseballRepository.findOne({ id: id })
    const isNumber = (n: string) => n.match(new RegExp(/^[0-9]$/g))

    if (args[0] == "시작") {
      if (!user) {
        user = new Baseball()
        user.id = id
        user.isStarted = false
      }
      if (!user.isStarted) {
        user.isStarted = true
        user.turn = 0
        const numbers = [...Array(10).keys()]
          .slice(1)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
        user.number1 = numbers[0]
        user.number2 = numbers[1]
        user.number3 = numbers[2]
        await connection.manager.save(user)
        msg.channel.send("야구 게임을 시작합니다!")
      } else {
        msg.channel.send("이미 시작했습니다!")
      }
    } else if (args[0] == "포기") {
      if (!user) {
        msg.channel.send("게임중이 아닙니다!")
      } else if (user.isStarted) {
        user.isStarted = false
        connection.manager.save(user)
        msg.channel.send("게임을 포기합니다.")
        msg.channel.send(["정답은", user.number1, user.number2, user.number3, "이었습니다!"].join(" "))
      } else {
        msg.channel.send("게임 중이 아닙니다!")
      }
    } else if (args[0] == "기록") {
      if (!user) {
        msg.channel.send("기록이 없습니다!")
      } else {
        msg.channel.send(user.best ? "최고 기록 : " + user.best : "기록이 없습니다!")
      }
    } else if (args.slice(0, 3).every(isNumber)) {
      if (!user) {
        msg.channel.send("게임 중이 아닙니다!")
        return true
      }
      if (!user.isStarted) {
        msg.channel.send("게임 중이 아닙니다!")
        return true
      }

      let out = 0
      let ball = 0
      let strike = 0
      const answer = [user?.number1, user?.number2, user?.number3]
      args.slice(0, 3).forEach((cur, i) => {
        switch (answer.findIndex((v) => Number(cur) == v)) {
          case i:
            ++strike
            break
          case -1:
            ++out
            break
          default:
            ++ball
            break
        }
      })
      ++user.turn

      if (strike == 3) {
        msg.channel.send("정답을 맞혔습니다!")
        user.isStarted = false
        if (!user.best) user.best = user.turn
        if (user.best > user.turn) {
          user.best = user.turn
          msg.channel.send("최고 기록입니다!")
        }
        msg.channel.send("기록 : " + user.turn)
      }
      connection.manager.save(user)

      msg.channel.send(`S ${strike} B ${ball} O ${out}`)
    } else return false

    return true
  },
  usage: "게임 야구 {시작} 또는 {<숫자> <숫자> <숫자>} 또는 {포기} 또는 {기록}",
}
