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

@Module({
  imports: [
    configModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    AccountsModule,
    AuthModule,
    CategoriesModule,
    TestDbModule,
  ],
})
export class TestAppModule {}
