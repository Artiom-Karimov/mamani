import { Injectable } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import { Account } from '../entities/account.entity';

@Injectable()
export class TypeormAccountsRepository extends AccountsRepository {
  createOrUpdate(model: Account): Promise<string | undefined> {
    throw new Error('Method not implemented.');
  }
  get(id: string): Promise<Account | undefined> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<boolean | undefined> {
    throw new Error('Method not implemented.');
  }
}
