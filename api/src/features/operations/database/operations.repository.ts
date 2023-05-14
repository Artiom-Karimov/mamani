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
}
