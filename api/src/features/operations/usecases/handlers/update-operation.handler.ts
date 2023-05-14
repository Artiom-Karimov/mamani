import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { OperationsRepository } from '../../database/operations.repository';
import { Category } from '../../../operation-categories/entities/category.entity';
import { GetCategoryQuery } from '../../../operation-categories/usecases/queries/get-category.query';
import { OperationError } from '../../entities/operation-error';
import { UpdateOperationCommand } from '../commands/update-operation.command';
import { OperationsService } from '../../operations.service';

@CommandHandler(UpdateOperationCommand)
export class UpdateOperationHandler
  implements ICommandHandler<UpdateOperationCommand>
{
  constructor(
    private readonly repo: OperationsRepository,
    private readonly service: OperationsService,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: UpdateOperationCommand): Promise<string> {
    const operation = await this.repo.get(command.id);
    if (!operation) throw new NotFoundException('Operation not found');
    if (!operation.account)
      throw new NotFoundException('Cannot get operation.account');
    if (operation.account.userId !== command.userId)
      throw new ForbiddenException('Operation belongs to another user');

    let err = operation.update(command.data);

    if (command.data.categoryId) {
      const category = await this.getCategory(
        command.data.categoryId,
        command.userId,
      );
      err = operation.updateCategory(category);
    }

    if (err !== OperationError.NoError)
      throw new BadRequestException(this.service.errorText(err));

    return this.service.save(operation);
  }

  private async getCategory(id: string, userId: string): Promise<Category> {
    const category = await this.queryBus.execute(
      new GetCategoryQuery(id, userId),
    );
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }
}
