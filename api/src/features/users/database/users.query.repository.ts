import { Injectable, Logger } from '@nestjs/common';
import { ViewUserDto } from '../dto/view-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersQueryRepository {
  protected readonly logger = new Logger('UsersQueryRepository');

  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

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
