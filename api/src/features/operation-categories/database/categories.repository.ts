import { InjectRepository } from '@nestjs/typeorm';
import { TypeormCrudRepository } from '../../../shared/database/typeorm.crud.repository';
import { OperationCategory } from '../entities/operation-category.entity';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

export class CategoriesRepository extends TypeormCrudRepository<OperationCategory> {
  constructor(
    @InjectRepository(OperationCategory)
    repo: Repository<OperationCategory>,
  ) {
    super(repo, new Logger('CategoriesRepository'));
  }
}
