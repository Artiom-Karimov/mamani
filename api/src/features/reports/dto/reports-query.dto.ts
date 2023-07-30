import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { OperationType } from '../../operations/entities/operation-type';

export class ReportsQueryDto {
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  endDate?: Date;

  @IsOptional()
  @IsEnum(OperationType)
  type?: OperationType;
}
