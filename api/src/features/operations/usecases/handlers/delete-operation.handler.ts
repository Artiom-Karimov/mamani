import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { OperationsRepository } from '../../database/operations.repository';
import { DeleteOperationCommand } from '../commands/delete-operation.command';

@CommandHandler(DeleteOperationCommand)
export class DeleteOperationHandler
  implements ICommandHandler<DeleteOperationCommand>
{
  constructor(private readonly repo: OperationsRepository) {}

  async execute(command: DeleteOperationCommand): Promise<void> {
    const operation = await this.repo.get(command.id);
    if (!operation) throw new NotFoundException('Operation not found');
    if (!operation.account)
      throw new NotFoundException('Cannot get operation.account');
    if (operation.account.userId !== command.userId)
      throw new ForbiddenException('Operation belongs to another user');

    const deleted = await this.repo.delete(command.id);
    if (!deleted) throw new BadRequestException('Cannot delete operation');
  }
}
