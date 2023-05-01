import { Injectable } from '@nestjs/common';
import { AccountsRepository } from './database/accounts.repository';

@Injectable()
export class AccountsService {
  constructor(private readonly repo: AccountsRepository) {}

  async releaseDefaultAccount(userId: string): Promise<void> {
    const account = await this.repo.getByPartial({
      userId,
      default: true,
    });

    if (!account) return;

    account.default = false;
    await this.repo.createOrUpdate(account);
  }
}
