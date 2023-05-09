import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { ViewCategoryDto } from '../dto/view-category.dto';

export class CategoriesQueryRepository {
  private readonly logger = new Logger('AccountsQueryRepository');

  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  async get(id: string): Promise<ViewCategoryDto | undefined> {
    try {
      const result = await this.repo.findOneBy({ id });
      return result ? new ViewCategoryDto(result) : undefined;
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }
  async getByUser(userId: string): Promise<ViewCategoryDto[]> {
    try {
      const result = await this.repo.find({
        where: [{ userId }, { userId: IsNull() }],
        order: { userId: 'DESC', name: 'DESC', createdAt: 'DESC' },
      });
      return result.map((a) => new ViewCategoryDto(a));
    } catch (error) {
      this.logger.error(error);
      return [];
    }
  }
}
