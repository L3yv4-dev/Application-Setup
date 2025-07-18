
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  roles?: string;

  @Column({ select: false })
  password!: string;
}
