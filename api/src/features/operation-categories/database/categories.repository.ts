import { InjectRepository } from '@nestjs/typeorm';
import { TypeormCrudRepository } from '../../../shared/database/typeorm.crud.repository';
import { Category } from '../entities/category.entity';
import { IsNull, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

export class CategoriesRepository extends TypeormCrudRepository<Category> {
  constructor(
    @InjectRepository(Category)
    repo: Repository<Category>,
  ) {
    super(repo, new Logger('CategoriesRepository'));
  }

  async nameExists(name: string, userId: string): Promise<boolean> {
    try {
      const existing = await this.repo.findOneBy([
        { name, userId },
        { name, userId: IsNull() },
      ]);

      return existing != null;
    } catch (error) {
      this.logger.error(error);
      return true;
    }
  }
}
