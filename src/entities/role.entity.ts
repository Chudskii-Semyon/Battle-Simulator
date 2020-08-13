import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoleEnum } from '../enums/user-role.enum';
import { OneToMany } from 'typeorm/index';
import { User } from './user.entity';


@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.DEFAULT })
  public name: UserRoleEnum;

  @OneToMany(type => User, user => user.role)
  public users: User[];
}