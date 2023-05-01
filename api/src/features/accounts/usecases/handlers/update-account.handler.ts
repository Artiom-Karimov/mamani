import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { AccountsRepository } from '../../database/accounts.repository';
import { UpdateAccountCommand } from '../commands/update-account.command';
import { AccountsService } from '../../accounts.service';

@CommandHandler(UpdateAccountCommand)
export class UpdateAccountHandler
  implements ICommandHandler<UpdateAccountCommand>
{
  constructor(
    private readonly repo: AccountsRepository,
    private readonly service: AccountsService,
  ) {}

  async execute(command: UpdateAccountCommand): Promise<void> {
    const { id, userId, data } = command;

    const account = await this.repo.get(id);
    if (!account) throw new NotFoundException('Account not found');
    if (account.userId !== userId)
      throw new ForbiddenException("You cannot update someone else's account");

    if (data.default && !account.default)
      await this.service.releaseDefaultAccount(userId);

    account.update(data);

    const result = await this.repo.createOrUpdate(account);
    if (!result) throw new BadRequestException('Cannot update account');
  }
}
