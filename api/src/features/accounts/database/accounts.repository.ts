import { Injectable, Logger } from '@nestjs/common';
import { CrudRepository } from '../../../shared/models/crud.repository';
import { Account } from '../entities/account.entity';

@Injectable()
export abstract class AccountsRepository implements CrudRepository<Account> {
  protected readonly logger = new Logger('AccountsRepository');

  abstract createOrUpdate(model: Account): Promise<string | undefined>;
  abstract get(id: string): Promise<Account | undefined>;
  abstract delete(id: string): Promise<boolean | undefined>;
}
