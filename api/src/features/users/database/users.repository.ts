import { Injectable, Logger } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { TypeormCrudRepository } from '../../../shared/database/typeorm.crud.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository extends TypeormCrudRepository<User> {
  constructor(@InjectRepository(User) repo: Repository<User>) {
    super(repo, new Logger('UsersRepository'));
  }
}
