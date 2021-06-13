import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class User {
  @PrimaryColumn()
  id!: string

  @Column()
  level!: number
}
