import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { AccountsRepository } from './database/accounts.repository';
import { TypeormAccountsRepository } from './database/typeorm.accounts.repository';
import { AccountsQueryRepository } from './database/accounts.query.repository';
import { TypeormAccountsQueryRepository } from './database/typeorm.accounts.query.repository';
import { UsersModule } from '../users/users.module';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Account]), UsersModule],
  controllers: [AccountsController],
  providers: [
    AccountsService,
    {
      provide: AccountsRepository,
      useClass: TypeormAccountsRepository,
    },
    {
      provide: AccountsQueryRepository,
      useClass: TypeormAccountsQueryRepository,
    },
  ],
  exports: [AccountsRepository, AccountsQueryRepository],
})
export class AccountsModule {}
