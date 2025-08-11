import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  lecturerId?: number;

  @Column()
  courseCode?: string;

  @Column()
  courseName?: string;

}
