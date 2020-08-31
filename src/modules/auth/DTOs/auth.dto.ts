import { User } from '../../../entities/user.entity';

export class AuthDto {
  public token: string;
  public user: User;
}
