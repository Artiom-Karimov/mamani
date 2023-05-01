import { Injectable, Logger } from '@nestjs/common';
import { Account } from '../entities/account.entity';
import { TypeormCrudRepository } from '../../../shared/database/typeorm.crud.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AccountsRepository extends TypeormCrudRepository<Account> {
  constructor(@InjectRepository(Account) repo: Repository<Account>) {
    super(repo, new Logger('AccountsRepository'));
  }
}
