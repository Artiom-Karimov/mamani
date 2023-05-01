import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersRepository } from './users.repository';
import { Repository } from 'typeorm';
import { TypeormCrudRepository } from '../../../shared/database/typeorm.crud.repository';

export class TypeormUsersRepository extends UsersRepository {
  private readonly crudRepo: TypeormCrudRepository<User>;

  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {
    super();
    this.crudRepo = new TypeormCrudRepository(this.repo, this.logger);
  }

  async createOrUpdate(model: User): Promise<string | undefined> {
    return this.crudRepo.createOrUpdate(model);
  }
  async get(id: string): Promise<User | undefined> {
    return this.crudRepo.get(id);
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
    return this.crudRepo.delete(id);
  }
}
