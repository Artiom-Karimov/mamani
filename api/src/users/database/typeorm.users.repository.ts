import { User } from '../entities/user.entity';
import { UsersRepository } from './users.repository';

export class TypeormUsersRepository extends UsersRepository {
  createOrUpdate(model: User): Promise<string> {
    throw new Error('Method not implemented.');
  }
  get(id: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
  getByEmail(email: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
