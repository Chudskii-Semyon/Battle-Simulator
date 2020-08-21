import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity()
export class Operator {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ default: 0 })
  public experience: number;

  @Column({ width: 3, default: 100 })
  public healthPoints: number;

  @Column({ width: 4, default: 1500 })
  public recharge: number;

  @Column()
  @RelationId((operator: Operator) => operator.vehicle)
  public vehicleId: number;

  @ManyToOne(type => Vehicle, { onDelete: 'CASCADE' })
  public vehicle: Vehicle;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
