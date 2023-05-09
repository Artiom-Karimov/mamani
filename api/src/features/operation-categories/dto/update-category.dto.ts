import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { expressions } from '../../../shared/models/regex';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(300)
  description?: string;

  @IsOptional()
  @Matches(expressions.color)
  @ApiProperty({ required: false, example: '#00fade' })
  color?: string;
}
