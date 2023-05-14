import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operation } from '../entities/operation.entity';
import { ViewOperationDto } from '../dto/view-operation.dto';

export class OperationsQueryRepository {
  private readonly logger = new Logger('OperationsQueryRepository');

  constructor(
    @InjectRepository(Operation)
    private readonly repo: Repository<Operation>,
  ) {}

  async get(id: string, userId: string): Promise<ViewOperationDto | undefined> {
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
}
