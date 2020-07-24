import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class SignInDto {
  @Expose()
  @IsString()
  public email: string;

  @Expose()
  @IsString()
  public password: string;
}
