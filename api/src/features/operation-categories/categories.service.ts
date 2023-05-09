import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoriesRepository } from './database/categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly repo: CategoriesRepository) {}

  async checkNameExists(name: string, userId: string): Promise<void> {
    const nameExists = await this.repo.nameExists(name, userId);
    if (nameExists)
      throw new BadRequestException(`Category "${name}" already exists.`);
  }
}
