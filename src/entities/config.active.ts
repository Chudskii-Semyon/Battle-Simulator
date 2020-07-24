import { Entity, OneToOne, JoinColumn, Unique } from 'typeorm';
import { Config } from './config.entity';

@Entity()
@Unique(['config'])
export class ConfigActive {
  @OneToOne(type => Config, { primary: true })
  @JoinColumn()
  public config: Config;
}
