import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  hash: string;

  @BeforeInsert()
  lowerEmail() {
    this.email = this.email.toLowerCase();
  }
}
