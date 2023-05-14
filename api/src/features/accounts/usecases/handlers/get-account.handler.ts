import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAccountQuery } from '../queries/get-account.query';
import { Account } from '../../entities/account.entity';
import { AccountsRepository } from '../../database/accounts.repository';

@QueryHandler(GetAccountQuery)
export class GetAccountHandler implements IQueryHandler<GetAccountQuery> {
  constructor(private readonly repo: AccountsRepository) {}

  async execute(query: GetAccountQuery): Promise<Account | undefined> {
    const result = await this.repo.get(query.id);
    if (!result) return undefined;
    if (result.userId !== query.userId) return undefined;
    return result;
  }
}
