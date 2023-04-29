import { InjectRepository } from '@nestjs/typeorm';
import { ViewUserDto } from '../dto/view-user.dto';
import { UsersQueryRepository } from './users.query.repository';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeormUsersQueryRepository extends UsersQueryRepository {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {
    super();
  }

  async get(id: string): Promise<ViewUserDto | undefined> {
    try {
      const result = await this.repo.findOneBy({ id });
      return result ? new ViewUserDto(result) : undefined;
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }
}
