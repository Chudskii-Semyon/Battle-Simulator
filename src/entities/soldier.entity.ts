import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Squad } from './squad';

@Entity()
export class Soldier extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ default: 0 })
  public experience: number;

  @Column({ default: 100 })
  public healthPoints: number;

  @Column({ default: 2000 })
  public recharge: number;

  @Column()
  @RelationId((soldier: Soldier) => soldier.squad)
  public squadId: number;

  @ManyToOne(type => Squad, { onDelete: 'CASCADE' })
  public squad: Squad;
}
