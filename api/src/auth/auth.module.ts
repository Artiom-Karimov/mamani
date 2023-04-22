import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RegisterHandler } from './usecases/handlers/register.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from '../users/users.module';
import { LoginHandler } from './usecases/handlers/login.handler';

@Module({
  imports: [CqrsModule, UsersModule],
  controllers: [AuthController],
  providers: [RegisterHandler, LoginHandler],
})
export class AuthModule { }
