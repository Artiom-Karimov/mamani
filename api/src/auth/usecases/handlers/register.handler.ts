import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from '../commands/register.command';
import { UsersRepository } from '../../../users/database/users.repository';
import { BadRequestException } from '@nestjs/common';
import { User } from '../../../users/entities/user.entity';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(private readonly repository: UsersRepository) {}

  async execute(command: RegisterCommand): Promise<string> {
    const { data } = command;

    const existing = await this.repository.getByEmail(data.email);
    if (existing)
      throw new BadRequestException(`User ${data.email} already exists`);

    const user = await User.create(data);
    const id = await this.repository.createOrUpdate(user);
    if (!id) throw new BadRequestException('User cannot be created');

    return id;
  }
}
