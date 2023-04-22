import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './database/users.repository';
import { TypeormUsersRepository } from './database/typeorm.users.repository';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: UsersRepository,
      useClass: TypeormUsersRepository,
    },
  ],
  exports: [UsersRepository],
})
export class UsersModule { }
