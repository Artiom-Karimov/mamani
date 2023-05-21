import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOperationDto {
  @IsUUID()
  accountId: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;
}
