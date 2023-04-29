import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { OperationsModule } from './operations/operations.module';
import { AuthModule } from './auth/auth.module';
import { OperationCategoriesModule } from './operation-categories/operation-categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DB,
      entities: [],
      synchronize: true,
    }),
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
