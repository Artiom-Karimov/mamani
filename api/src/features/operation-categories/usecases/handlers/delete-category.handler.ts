import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCategoryCommand } from '../commands/delete-category.command';
import { CategoriesRepository } from '../../database/categories.repository';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler
  implements ICommandHandler<DeleteCategoryCommand>
{
  constructor(private readonly repo: CategoriesRepository) {}

  async execute(command: DeleteCategoryCommand): Promise<void> {
    const category = await this.repo.get(command.id);
    if (!category) throw new NotFoundException('Category not found');

    if (category.userId !== command.userId)
      throw new ForbiddenException('Category belongs to another user');

    await this.checkHasChildren(command.id);

    // TODO: check if category has operations

    const result = await this.repo.delete(command.id);
    if (!result) throw new BadRequestException('Cannot delete category');
  }

  async checkHasChildren(id: string): Promise<void> {
    const child = await this.repo.getByField('parentId', id);
    if (child) throw new ForbiddenException('Category has children');
  }
}
