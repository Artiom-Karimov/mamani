import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../queries/get-user.query';
import { UsersQueryRepository } from '../../database/users.query.repository';
import { ViewUserDto } from '../../dto/view-user.dto';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly repo: UsersQueryRepository) {}

  async execute(query: GetUserQuery): Promise<ViewUserDto | undefined> {
    const user = await this.repo.get(query.id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
