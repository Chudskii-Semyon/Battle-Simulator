import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'casbin_rule' })
export class CasbinRules {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public ptype: string;

  @Column()
  public v0: string;

  @Column()
  public v1: string;

  @Column({ nullable: true })
  public v2: string;

  @Column({ nullable: true })
  public v3: string;

  @Column({ nullable: true })
  public v4: string;

  @Column({ nullable: true })
  public v5: string;
}
