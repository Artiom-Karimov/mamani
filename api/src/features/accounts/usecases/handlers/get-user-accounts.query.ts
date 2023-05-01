import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AccountsQueryRepository } from '../../database/accounts.query.repository';
import { ViewAccountDto } from '../../dto/view-account.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { GetUserAccountsQuery } from '../queries/get-user-accounts.query';

@QueryHandler(GetUserAccountsQuery)
export class GetUserAccountsHandler
  implements IQueryHandler<GetUserAccountsQuery>
{
  constructor(private readonly repo: AccountsQueryRepository) {}

  async execute(query: GetUserAccountsQuery): Promise<ViewAccountDto[]> {
    return this.repo.getByUser(query.userId);
  }
}
