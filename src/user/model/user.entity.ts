import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Bookmark } from './../../bookmark/bookmark.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  hash: string;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: string;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];

  @BeforeInsert()
  lowerEmail() {
    this.email = this.email.toLowerCase();
  }
}
