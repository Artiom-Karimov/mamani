import { ConfigModule } from '@nestjs/config';
// Leave this at the top for correct .env loading
const configModule = ConfigModule.forRoot({ isGlobal: true });

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestDbModule } from './db/test-db.module';
import { typeOrmConfig } from '../../src/config/typeorm.config';
import { UsersModule } from '../../src/features/users/users.module';
import { AccountsModule } from '../../src/features/accounts/accounts.module';
import { AuthModule } from '../../src/features/auth/auth.module';
import { CategoriesModule } from '../../src/features/operation-categories/categories.module';
import { OperationsModule } from '../../src/features/operations/operations.module';
import { ReportsModule } from '../../src/features/reports/reports.module';

@Module({
  imports: [
    configModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    AccountsModule,
    OperationsModule,
    AuthModule,
    CategoriesModule,
    ReportsModule,
    TestDbModule,
  ],
})
export class TestAppModule {}
