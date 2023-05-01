import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './database/users.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersQueryRepository } from './database/users.query.repository';
import { TypeormUsersQueryRepository } from './database/typeorm.users.query.repository';
import { GetUserHandler } from './usecases/handlers/get-user.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    GetUserHandler,
    UsersRepository,
    {
      provide: UsersQueryRepository,
      useClass: TypeormUsersQueryRepository,
    },
  ],
  exports: [UsersRepository, UsersQueryRepository],
})
export class UsersModule {}
