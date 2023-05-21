import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Operation } from '../entities/operation.entity';
import { ViewOperationDto } from '../dto/view-operation.dto';
import { OperationsQueryDto } from '../dto/operations.query.dto';
import { OperationPageDto } from '../dto/operation-page.dto';
import { OperationSortKey } from '../dto/operation-sort-key';
import { SortDirection } from '../../../shared/models/sort-direction';

export class OperationsQueryRepository {
  private readonly logger = new Logger('OperationsQueryRepository');

  constructor(
    @InjectRepository(Operation)
    private readonly repo: Repository<Operation>,
  ) {}

  async findOne(
    id: string,
    userId: string,
  ): Promise<ViewOperationDto | undefined> {
    try {
      const result = await this.repo.findOne({
        where: { id },
        relations: { category: true, account: true },
      });
      if (!result) return undefined;
      if (result.account?.userId !== userId) return undefined;
      return new ViewOperationDto(result);
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }

  async findMany(
    query: OperationsQueryDto,
    userId: string,
  ): Promise<OperationPageDto> {
    try {
      return this.loadPage(query, userId);
    } catch (error) {
      this.logger.error(error);
      return new OperationPageDto(query.pageSize);
    }
  }

  private async loadPage(
    query: OperationsQueryDto,
    userId: string,
  ): Promise<OperationPageDto> {
    const builder = this.getBuilder(userId);
    this.sort(builder, query);
    this.limit(builder, query);

    const [result, count] = await builder.getManyAndCount();

    const page = new OperationPageDto(query.pageSize, query.page, count);
    const views = result.map((o) => new ViewOperationDto(o));
    return page.add(...views);
  }

  private getBuilder(userId: string): SelectQueryBuilder<Operation> {
    return this.repo
      .createQueryBuilder('operation')
      .leftJoinAndSelect('operation.category', 'category')
      .leftJoinAndSelect('operation.account', 'account')
      .where(`"account"."userId" = '${userId}'`);
  }
  private sort(
    builder: SelectQueryBuilder<Operation>,
    query: OperationsQueryDto,
  ): SelectQueryBuilder<Operation> {
    if (query.sortBy === OperationSortKey.createdAt) {
      return builder.orderBy('"operation"."createdAt"', query.sortDirection);
    }

    const sortKey = this.sortKey(query.sortBy);
    return builder
      .orderBy(sortKey, query.sortDirection)
      .addOrderBy('"operation"."createdAt"', SortDirection.DESC);
  }
  private limit(
    builder: SelectQueryBuilder<Operation>,
    query: OperationsQueryDto,
  ): SelectQueryBuilder<Operation> {
    return builder.offset(query.skip).limit(query.pageSize);
  }
  private sortKey(sortBy: OperationSortKey): string {
    if (sortBy === OperationSortKey.accountName) return '"account"."name"';
    if (sortBy === OperationSortKey.description)
      return '"operation"."description"';
    if (sortBy === OperationSortKey.amount) return '"amount"';
    if (sortBy === OperationSortKey.type) return '"operation"."type"';
    if (sortBy === OperationSortKey.categoryName) return '"category"."name"';
    throw new Error('Wrong sort key');
  }
}
