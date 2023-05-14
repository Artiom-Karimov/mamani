import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateOperationDto {
  @IsUUID()
  accountId: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsUUID()
  categoryId: string;

  @IsDate()
  createdAt?: Date;
}
