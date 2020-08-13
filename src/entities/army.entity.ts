import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Column, PrimaryGeneratedColumn } from 'typeorm/index';
import { StrategyEnum } from '../enums/strategy.enum';
import { User } from './user.entity';
import { Squad } from './squad';

@Entity()
export class Army {
  @PrimaryGeneratedColumn()
  public id: number;

  // @Column({ type: 'enum', enum: StrategyEnum, default: StrategyEnum.RANDOM })
  // public strategy: StrategyEnum;

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
