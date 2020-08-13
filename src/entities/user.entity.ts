import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  RelationId,
  Index,
} from 'typeorm';
import { BeforeInsert, ManyToOne } from 'typeorm/index';
import { Role } from './role.entity';
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

  @Exclude()
  @ManyToOne(
    type => Role,
    role => role.users,
    { nullable: false },
  )
  public role: Role;

  @Exclude()
  @RelationId((user: User) => user.role)
  public roleId: number;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @BeforeInsert()
  async setPassword(password: string): Promise<void> {
    const salt = await genSalt();
    this.password = await hash(password || this.password, salt);
  }
}
