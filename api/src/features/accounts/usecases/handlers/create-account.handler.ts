import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/database/users.repository';
import { BadRequestException } from '@nestjs/common';
import { CreateAccountCommand } from '../commands/create-account.command';
import { AccountsRepository } from '../../database/accounts.repository';
import { Account } from '../../entities/account.entity';
import { AccountsService } from '../../accounts.service';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand>
{
  constructor(
    private readonly accountsRepo: AccountsRepository,
    private readonly usersRepo: UsersRepository,
    private readonly service: AccountsService,
  ) {}

  async execute(command: CreateAccountCommand): Promise<string> {
    const { userId, data } = command;

    const user = await this.usersRepo.get(userId);
    if (!user) throw new BadRequestException('User does not exist');

    const account = new Account(user, data);
    if (account.default) await this.service.releaseDefaultAccount(user.id);

    const id = await this.accountsRepo.createOrUpdate(account);
    if (!id) throw new BadRequestException('Cannot create account');

    return id;
  }
}
