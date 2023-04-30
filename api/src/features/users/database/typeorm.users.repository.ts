import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersRepository } from './users.repository';
import { Repository } from 'typeorm';

export class TypeormUsersRepository extends UsersRepository {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {
    super();
  }

  async createOrUpdate(model: User): Promise<string | undefined> {
    try {
      const result = await this.repo.save(model);
      return result.id;
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }
  async get(id: string): Promise<User | undefined> {
    try {
      const result = await this.repo.findOneBy({ id });
      return result || undefined;
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }
  async getByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await this.repo.findOneBy({ email });
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
