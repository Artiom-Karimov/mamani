import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCategoryCommand } from '../commands/update-category.command';
import { CategoriesRepository } from '../../database/categories.repository';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from '../../categories.service';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler
  implements ICommandHandler<UpdateCategoryCommand>
{
  constructor(
    private readonly repo: CategoriesRepository,
    private readonly service: CategoriesService,
  ) {}

  async execute(command: UpdateCategoryCommand): Promise<string> {
    const category = await this.repo.get(command.id);
    if (!category) throw new NotFoundException('Category not found');

    if (category.userId !== command.userId)
      throw new ForbiddenException('Category belongs to another user');

    const { name } = command.data;
    if (name && name !== category.name)
      await this.service.checkNameExists(name, command.userId);

    category.update(command.data);
    const id = await this.repo.createOrUpdate(category);
    if (!id) throw new BadRequestException('Cannot update category');

    return id;
  }
}
