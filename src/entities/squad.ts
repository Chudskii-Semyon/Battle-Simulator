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
import { Army } from './army.entity';
import { Vehicle } from './vehicle.entity';
import { Soldier } from './soldier.entity';
import { StrategyEnum } from '../enums/strategy.enum';

@Entity()
export class Squad {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'enum', enum: StrategyEnum, default: StrategyEnum.RANDOM })
  public strategy: StrategyEnum;

  @ManyToOne(type => Army, { onDelete: 'CASCADE' })
  public army: Army;

  @Column()
  @RelationId((squad: Squad) => squad.army)
  public armyId: number;

  @OneToMany(
    type => Soldier,
    soldier => soldier.squad,
  )
  public soldiers: Soldier[];

  @OneToMany(
    type => Vehicle,
    vehicle => vehicle.squad,
  )
  public vehicles: Vehicle[];

  @Column()
  public name: string;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}
