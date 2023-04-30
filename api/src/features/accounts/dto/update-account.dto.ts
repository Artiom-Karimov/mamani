import {
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { expressions } from '../../../shared/models/regex';

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @IsOptional()
  @IsBoolean()
  default?: boolean;

  @IsOptional()
  @Matches(expressions.color)
  color?: string;
}
