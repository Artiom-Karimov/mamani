import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { AccountsRepository } from './database/accounts.repository';
import { AccountsQueryRepository } from './database/accounts.query.repository';
import { TypeormAccountsQueryRepository } from './database/typeorm.accounts.query.repository';
import { UsersModule } from '../users/users.module';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { CreateAccountHandler } from './usecases/handlers/create-account.handler';
import { GetAccountHandler } from './usecases/handlers/get-account.handler';

const handlers = [CreateAccountHandler, GetAccountHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Account]), UsersModule],
  controllers: [AccountsController],
  providers: [
    AccountsService,
    AccountsRepository,
    {
      provide: AccountsQueryRepository,
      useClass: TypeormAccountsQueryRepository,
    },
    ...handlers,
  ],
  exports: [AccountsRepository, AccountsQueryRepository],
})
export class AccountsModule {}
