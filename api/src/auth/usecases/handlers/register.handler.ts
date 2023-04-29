import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from '../commands/register.command';
import { UsersRepository } from '../../../users/database/users.repository';
import { BadRequestException } from '@nestjs/common';
import { User } from '../../../users/entities/user.entity';
import { ViewUserDto } from '../../../users/dto/view-user.dto';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(private readonly repository: UsersRepository) {}

  async execute(command: RegisterCommand): Promise<ViewUserDto> {
    const { data } = command;

    const existing = await this.repository.getByEmail(data.email);
    if (existing)
      throw new BadRequestException(`User ${data.email} already exists`);

    const user = await User.create(data);
    const id = await this.repository.createOrUpdate(user);
    const result = await this.repository.get(id);
    if (!result) throw new BadRequestException('User cannot be created');

    return new ViewUserDto(result);
  }
}
