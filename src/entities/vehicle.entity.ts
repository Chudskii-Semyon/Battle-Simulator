import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Squad } from './squad.entity';
import { Operator } from './operator.entity';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ width: 3, default: 100 })
  public healthPoints: number;

  @Column({ width: 4, default: 2000 })
  public recharge: number;

  @OneToMany(
    () => Operator,
    operator => operator.vehicle,
  )
  public operators: Operator[];

  @Column()
  @RelationId((vehicle: Vehicle) => vehicle.squad)
  public squadId: number;

  @ManyToOne(() => Squad, { onDelete: 'CASCADE' })
  public squad: Squad;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
