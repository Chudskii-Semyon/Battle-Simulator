import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Squad } from './squad.entity';

@Entity()
export class Soldier {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ default: 0 })
  public experience: number;

  @Column({ default: 100 })
  public healthPoints: number;

  @Column({ default: 1500 })
  public recharge: number;

  @Column()
  @RelationId((soldier: Soldier) => soldier.squad)
  public squadId: number;

  @ManyToOne(type => Squad, { onDelete: 'CASCADE' })
  public squad: Squad;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
