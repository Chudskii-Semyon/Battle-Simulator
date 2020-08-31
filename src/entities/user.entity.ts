import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BeforeInsert } from 'typeorm/index';
import { genSalt, hash } from 'bcrypt';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @Index()
  public name: string;

  @Column()
  @Index()
  public email: string;

  @Exclude()
  @Column()
  public password: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @BeforeInsert()
  async setPassword(password: string): Promise<void> {
    const salt = await genSalt();
    this.password = await hash(password || this.password, salt);
  }
}
