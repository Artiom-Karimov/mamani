import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { AccountsRepository } from './database/accounts.repository';
import { TypeormAccountsRepository } from './database/typeorm.accounts.repository';
import { AccountsQueryRepository } from './database/accounts.query.repository';
import { TypeormAccountsQueryRepository } from './database/typeorm.accounts.query.repository';

@Module({
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
})
export class AccountsModule {}
