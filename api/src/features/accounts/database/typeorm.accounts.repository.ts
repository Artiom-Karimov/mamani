import { Injectable } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import { Account } from '../entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeormCrudRepository } from '../../../shared/database/typeorm.crud.repository';

@Injectable()
export class TypeormAccountsRepository extends AccountsRepository {
  private readonly crudRepo: TypeormCrudRepository<Account>;

  constructor(
    @InjectRepository(Account) private readonly repo: Repository<Account>,
  ) {
    super();
    this.crudRepo = new TypeormCrudRepository(this.repo, this.logger);
  }

  createOrUpdate(model: Account): Promise<string | undefined> {
    return this.crudRepo.createOrUpdate(model);
  }
  get(id: string): Promise<Account | undefined> {
    return this.crudRepo.get(id);
  }
  delete(id: string): Promise<boolean | undefined> {
    return this.crudRepo.delete(id);
  }
}
