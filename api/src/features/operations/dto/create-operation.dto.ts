import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { OperationType } from '../entities/operation-type';

export class CreateOperationDto {
  @IsUUID()
  accountId: string;

  @IsEnum(OperationType)
  type: OperationType;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsDate()
  createdAt?: Date;
}
