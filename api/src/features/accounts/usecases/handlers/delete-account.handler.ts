import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { AccountsRepository } from '../../database/accounts.repository';
import { DeleteAccountCommand } from '../commands/delete-account.command';

@CommandHandler(DeleteAccountCommand)
export class DeleteAccountHandler
  implements ICommandHandler<DeleteAccountCommand>
{
  constructor(private readonly repo: AccountsRepository) {}

  async execute(command: DeleteAccountCommand): Promise<void> {
    const { id, userId } = command;

    const account = await this.repo.get(id);
    if (!account) throw new NotFoundException('Account not found');
    if (account.userId !== userId)
      throw new ForbiddenException("You cannot delete someone else's account");

    const result = await this.repo.delete(id);
    if (!result) throw new BadRequestException('Cannot delete account');
  }
}
