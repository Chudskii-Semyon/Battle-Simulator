import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { ConfigActive } from './config.active';

@Entity()
export class Config {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ default: 100 })
  public maxHealthPoints: number;

  @Column({ default: 12 })
  public numberOfUnitsPerSquad: number;

  @Column({ default: 4 })
  public numberOfSquadsPerArmy: number;

  @OneToOne(
    type => ConfigActive,
    configActive => configActive.config,
  )
  public active: ConfigActive;
}
