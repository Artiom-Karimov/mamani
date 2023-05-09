import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoryQuery } from '../queries/get-category.query';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CategoriesQueryRepository } from '../../database/categories.query.repository';
import { ViewCategoryDto } from '../../dto/view-category.dto';

@QueryHandler(GetCategoryQuery)
export class GetCategoryHandler implements IQueryHandler<GetCategoryQuery> {
  constructor(private readonly repo: CategoriesQueryRepository) {}

  async execute(query: GetCategoryQuery): Promise<ViewCategoryDto> {
    const result = await this.repo.get(query.id);
    if (!result) throw new NotFoundException('Category not found');

    if (result.userId && result.userId !== query.userId)
      throw new ForbiddenException('Category belongs to another user');

    return result;
  }
}
