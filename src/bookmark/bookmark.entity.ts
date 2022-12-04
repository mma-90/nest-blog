import { User } from './../user/model/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  desc: string;

  @Column()
  link: string;

  @ManyToOne(() => User, (user) => user.bookmarks)
  user: User;

  @BeforeInsert()
  lowerInputs() {
    this.title = this.title.toLowerCase();
    this.desc = this.desc.toLowerCase();
  }
}
