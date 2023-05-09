import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { OperationCategory } from '../entities/operation-category.entity';
import { ViewOperationCategoryDto } from '../dto/view-operation-category.dto';

export class CategoriesQueryRepository {
  private readonly logger = new Logger('AccountsQueryRepository');

  constructor(
    @InjectRepository(OperationCategory)
    private readonly repo: Repository<OperationCategory>,
  ) {}

  async get(id: string): Promise<ViewOperationCategoryDto | undefined> {
    try {
      const result = await this.repo.findOneBy({ id });
      return result ? new ViewOperationCategoryDto(result) : undefined;
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }
  async getByUser(userId: string): Promise<ViewOperationCategoryDto[]> {
    try {
      const result = await this.repo.find({
        where: [{ userId }, { userId: IsNull() }],
        order: { userId: 'DESC', name: 'DESC', createdAt: 'DESC' },
      });
      return result.map((a) => new ViewOperationCategoryDto(a));
    } catch (error) {
      this.logger.error(error);
      return [];
    }
  }
}
