import { IsDate, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { OperationType } from '../entities/operation-type';
import { OperationSortKey } from './operation-sort-key';
import { PageQueryDto } from '../../../shared/models/page-query.dto';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OperationsQueryDto extends PageQueryDto {
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

  @IsOptional()
  @IsUUID()
  accountId?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsEnum(OperationSortKey)
  @ApiProperty({ required: false, enum: OperationSortKey })
  sortBy = OperationSortKey.createdAt;
}
