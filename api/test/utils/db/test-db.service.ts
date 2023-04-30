import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../src/features/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Account } from '../../../src/features/accounts/entities/account.entity';

@Injectable()
export class TestDbService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Account)
    private readonly accountsRepo: Repository<Account>,
  ) {}

  async clearAll(): Promise<void> {
    await this.accountsRepo.delete({});
    await this.usersRepo.delete({});
  }
}
