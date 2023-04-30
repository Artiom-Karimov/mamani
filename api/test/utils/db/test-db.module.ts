import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestDbService } from './test-db.service';
import { User } from '../../../src/features/users/entities/user.entity';
import { Account } from '../../../src/features/accounts/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account])],
  providers: [TestDbService],
  exports: [TestDbService],
})
export class TestDbModule {}
