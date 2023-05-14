import { InjectRepository } from '@nestjs/typeorm';
import { TypeormCrudRepository } from '../../../shared/database/typeorm.crud.repository';
import { Operation } from '../entities/operation.entity';
import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OperationsRepository extends TypeormCrudRepository<Operation> {
  constructor(@InjectRepository(Operation) repo: Repository<Operation>) {
    super(repo, new Logger('OperationsRepository'));
  }

  override async get(id: string): Promise<Operation | undefined> {
    try {
      const result = await this.repo.findOne({
        where: { id },
        relations: {
          account: true,
          category: true,
        },
      } as any);
      return result || undefined;
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }
}
