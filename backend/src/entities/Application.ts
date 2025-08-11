import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Course } from "./Course"

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  candidate?: number;

  @Column()
  courseCode?: string;

  @Column()
  name?: string;

  @Column()
  previousRole?: string;

  @Column()
  role?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @Column()
  status?: number;

  @Column("simple-array", { nullable: true })
  skills?: string[];

  @Column()
  availability?: string;
  
  @Column()
  academics?: string

  @Column()
  chosen?: boolean

  @Column()
  ranking?: number;

  @Column()
  comment?: string;
}
