import { expressions } from '@mamani/shared';
import { IsEmail, IsOptional, Length, Matches } from 'class-validator';

export class SelfUpdateUserDTO {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Length(1, 100)
  firstName?: string;

  @IsOptional()
  @Length(1, 100)
  lastName?: string;

  @IsOptional()
  @Length(1, 20)
  oldPassword: string;

  @IsOptional()
  @Matches(expressions.password)
  newPassword?: string;
}
