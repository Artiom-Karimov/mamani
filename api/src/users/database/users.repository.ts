import { CrudRepository } from '../../shared/models/crud.repository';
import { User } from '../entities/user.entity';

export abstract class UsersRepository implements CrudRepository<User> {
  abstract createOrUpdate(model: User): Promise<string>;
  abstract get(id: string): Promise<User>;
  abstract getByEmail(email: string): Promise<User>;
  abstract delete(id: string): Promise<boolean>;
}
