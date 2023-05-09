import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CategoriesQueryRepository } from '../../database/categories.query.repository';
import { ViewCategoryDto } from '../../dto/view-category.dto';
import { GetUserCategoriesQuery } from '../queries/get-user-categories.query';

@QueryHandler(GetUserCategoriesQuery)
export class GetUserCategoriesHandler
  implements IQueryHandler<GetUserCategoriesQuery>
{
  constructor(private readonly repo: CategoriesQueryRepository) {}

  async execute(query: GetUserCategoriesQuery): Promise<ViewCategoryDto[]> {
    const result = await this.repo.getByUser(query.userId);
    return ViewCategoryDto.removeChildrenFromList(result);
  }
}
