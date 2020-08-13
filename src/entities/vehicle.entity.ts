import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  RelationId,
  OneToMany,
} from 'typeorm';
import { Squad } from './squad';
import { Operator } from './operator.entity';

@Entity()
export class Vehicle extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ width: 3, default: 100 })
  public healthPoints: number;

  @Column({ width: 4, default: 2000 })
  public recharge: number;

  @OneToMany(
    type => Operator,
    operator => operator.vehicle,
  )
  public operators: Operator[];

  @Column()
  @RelationId((vehicle: Vehicle) => vehicle.squad)
  public squadId: number;

  @ManyToOne(type => Squad, { onDelete: 'CASCADE' })
  public squad: Squad;
}
