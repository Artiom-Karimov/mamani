import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCategoryCommand } from '../commands/create-category.command';
import { CategoriesRepository } from '../../database/categories.repository';
import { UsersRepository } from '../../../users/database/users.repository';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from '../../categories.service';
import { Category } from '../../entities/category.entity';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler
  implements ICommandHandler<CreateCategoryCommand>
{
  constructor(
    private readonly repo: CategoriesRepository,
    private readonly usersRepo: UsersRepository,
    private readonly service: CategoriesService,
  ) {}

  async execute(command: CreateCategoryCommand): Promise<string> {
    const user = await this.usersRepo.get(command.userId);
    if (!user) throw new NotFoundException('User not found');

    const { name, parentId } = command.data;
    await this.service.checkNameExists(name, user.id);

    const parent = await this.getParent(parentId, user.id);

    const model = new Category(command.data, user, parent);
    const id = await this.repo.createOrUpdate(model);
    if (!id) throw new BadRequestException('Cannot create category');
    return id;
  }

  async getParent(
    id: string | undefined,
    userId: string,
  ): Promise<Category | undefined> {
    if (!id) return undefined;

    const parent = await this.repo.get(id);
    if (!parent) throw new NotFoundException('Parent not found');

    if (parent.userId && parent.userId !== userId)
      throw new ForbiddenException('Parent belongs to another user');

    if (parent.parentId)
      throw new ForbiddenException(
        'Category can have only 1-level inheritance',
      );

    return parent;
  }
}
