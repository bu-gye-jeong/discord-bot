import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class Baseball {
  @PrimaryColumn()
  id!: string

  @Column()
  isStarted!: boolean

  @Column()
  number1!: number

  @Column()
  number2!: number

  @Column()
  number3!: number

  @Column()
  turn!: number

  @Column({ nullable: true })
  best?: number
}
