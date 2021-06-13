import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class Prefix {
  @PrimaryColumn()
  id!: string

  @Column()
  prefix!: string
}
