import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { SortDirection } from './sort-direction';
import { Type } from 'class-transformer';

export class PageQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  @Type(() => Number)
  pageSize = 20;

  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection = SortDirection.DESC;

  get skip(): number {
    return (this.page - 1) * this.pageSize;
  }
}
