import { Injectable, Logger } from '@nestjs/common';
import { ReportItemDto } from '../dto/report-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Operation } from '../../operations/entities/operation.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ReportsQueryDto } from '../dto/reports-query.dto';
import { StringToNumber } from '../../../shared/tools/string-to-number';

@Injectable()
export class ReportsQueryRepository {
  private readonly logger = new Logger('ReportsQueryRepository');

  constructor(
    @InjectRepository(Operation)
    private readonly repo: Repository<Operation>,
  ) {}

  public async getCategoryReport(
    userId: string,
    categoryId: string,
    query: ReportsQueryDto,
  ): Promise<ReportItemDto | undefined> {
    try {
      let builder = this.repo
        .createQueryBuilder('op')
        .leftJoin('op.account', 'ac')
        .leftJoinAndSelect('op.category', 'ca')
        .where('ac.userId = :userId and op.categoryId = :categoryId', {
          userId,
          categoryId,
        });

      builder = this.appendQuery(builder, query)
        .select('SUM(op.amount)', 'total')
        .addSelect('ca.name', 'categoryName')
        .addSelect('ca.id', 'categoryId')
        .groupBy('ca.id');

      const result = await builder.execute();
      if (!result) return undefined;

      return {
        categoryId: result[0].categoryId,
        categoryName: result[0].categoryName,
        total: StringToNumber.toNumber(result[0].total),
      };
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }

  private appendQuery(
    builder: SelectQueryBuilder<Operation>,
    { type, startDate, endDate }: ReportsQueryDto,
  ): SelectQueryBuilder<Operation> {
    if (type) {
      builder.andWhere('op.type = :type', { type });
    }
    if (startDate) {
      builder.andWhere('op.createdAt >= :startDate', { startDate });
    }
    if (endDate) {
      builder.andWhere('op.createdAt <= :endDate', { endDate });
    }

    return builder;
  }
}
