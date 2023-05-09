import { Repository } from 'typeorm';
import { CrudRepository } from './crud.repository';
import { Logger } from '@nestjs/common';
import { DomainEntity } from '../models/domain.entity';

export class TypeormCrudRepository<TModel extends DomainEntity>
  implements CrudRepository<TModel>
{
  constructor(
    protected readonly repo: Repository<TModel>,
    protected readonly logger: Logger,
  ) {}

  async createOrUpdate(model: TModel): Promise<string | undefined> {
    try {
      const result = await this.repo.save(model);
      return result.id;
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }
  async get(id: string): Promise<TModel | undefined> {
    try {
      const result = await this.repo.findOne({ where: { id } } as any);
      return result || undefined;
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }
  async getByField(
    key: keyof TModel,
    value: unknown,
  ): Promise<TModel | undefined> {
    try {
      const result = await this.repo.findOne({
        where: { [key]: value },
      } as any);
      return result || undefined;
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }
  async getByPartial(filter: Partial<TModel>): Promise<TModel | undefined> {
    try {
      const result = await this.repo.findOne({
        where: filter,
      } as any);
      return result || undefined;
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }
  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.repo.delete(id);
      return !!result.affected;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
