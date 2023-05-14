import { IsDate, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { OperationType } from '../entities/operation-type';
import { OperationSortKey } from './operation-sort-key';
import { PageQueryDto } from '../../../shared/models/page-query.dto';

export class OperationsQueryDto extends PageQueryDto {
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
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
  sortBy = OperationSortKey.createdAt;
}
