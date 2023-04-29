import { Logger } from '@nestjs/common';
import { CrudRepository } from '../../shared/models/crud.repository';
import { User } from '../entities/user.entity';

export abstract class UsersRepository implements CrudRepository<User> {
  protected readonly logger = new Logger('UsersRepository');

  abstract createOrUpdate(model: User): Promise<string | undefined>;
  abstract get(id: string): Promise<User | undefined>;
  abstract getByEmail(email: string): Promise<User | undefined>;
  abstract delete(id: string): Promise<boolean>;
}
