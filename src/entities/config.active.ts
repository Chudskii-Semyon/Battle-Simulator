import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from 'typeorm';
import { Config } from './config.entity';

@Entity()
@Unique(['config'])
export class ConfigActive {
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToOne(type => Config, { primary: true })
  @JoinColumn()
  public config: Config;

  @Column()
  @RelationId((config: ConfigActive) => config.config)
  public configId: number;
}
