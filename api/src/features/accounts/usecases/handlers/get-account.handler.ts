import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAccountQuery } from '../queries/get-account.query';
import { AccountsQueryRepository } from '../../database/accounts.query.repository';
import { ViewAccountDto } from '../../dto/view-account.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@QueryHandler(GetAccountQuery)
export class GetAccountHandler implements IQueryHandler<GetAccountQuery> {
  constructor(private readonly repo: AccountsQueryRepository) {}

  async execute(query: GetAccountQuery): Promise<ViewAccountDto> {
    const result = await this.repo.get(query.id);
    if (!result) throw new NotFoundException('Account not found');

    if (result.userId !== query.userId)
      throw new ForbiddenException("You cannot get someone else's account");

    return result;
  }
}
