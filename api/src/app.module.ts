import { ConfigModule } from '@nestjs/config';
// Leave this at the top for correct .env loading
const configModule = ConfigModule.forRoot({ isGlobal: true });

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './features/users/users.module';
import { AccountsModule } from './features/accounts/accounts.module';
import { OperationsModule } from './features/operations/operations.module';
import { AuthModule } from './features/auth/auth.module';
import { OperationCategoriesModule } from './features/operation-categories/operation-categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    configModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    AccountsModule,
    OperationsModule,
    AuthModule,
    OperationCategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
