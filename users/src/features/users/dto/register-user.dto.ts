import { expressions } from '@mamani/shared';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class RegisterUserDTO {
  @IsEmail()
  email: string;

  @IsString()
  @Length(1, 100)
  firstName: string;

  @IsString()
  @Length(1, 100)
  lastName: string;

  @Matches(expressions.password)
  password: string;
}
