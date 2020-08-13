import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class SignUpDto {
  @Expose()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  public name: string;

  @Expose()
  @IsEmail()
  public email: string;

  @Expose()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
  public password: string;
}