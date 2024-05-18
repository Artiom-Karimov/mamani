import { expressions, UserRole } from '@mamani/shared';
import { IsEmail, IsEnum, IsString, Length, Matches } from 'class-validator';

export class CreateUserDTO {
  @IsEnum(UserRole)
  role: UserRole;

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
