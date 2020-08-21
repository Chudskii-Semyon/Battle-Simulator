import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Squad } from './squad.entity';

@Entity()
export class Army {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @RelationId((army: Army) => army.user)
  public userId: number;

  @OneToOne(type => User)
  @JoinColumn()
  public user: User;

  @OneToMany(
    type => Squad,
    squad => squad.army,
  )
  public squads: Squad[];

  @Column()
  public name: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
