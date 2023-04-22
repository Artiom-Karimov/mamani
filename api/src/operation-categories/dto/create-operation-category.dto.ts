import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { OperationType } from '../../operations/entities/operation-type';
import { expressions } from '../../shared/models/regex';

export class CreateOperationCategoryDto {
  @IsEnum(OperationType)
  type: OperationType;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @IsOptional()
  @Matches(expressions.color)
  color?: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}
