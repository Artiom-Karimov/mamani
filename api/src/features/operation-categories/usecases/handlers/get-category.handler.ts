import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoryQuery } from '../queries/get-category.query';
import { Category } from '../../entities/category.entity';
import { CategoriesRepository } from '../../database/categories.repository';

@QueryHandler(GetCategoryQuery)
export class GetCategoryHandler implements IQueryHandler<GetCategoryQuery> {
  constructor(private readonly repo: CategoriesRepository) {}

  async execute(query: GetCategoryQuery): Promise<Category | undefined> {
    const result = await this.repo.get(query.id);
    if (!result) return undefined;
    if (result.userId && result.userId !== query.userId) return undefined;

    return result;
  }
}
