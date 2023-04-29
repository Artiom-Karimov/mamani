import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterCommand } from './usecases/commands/register.command';
import { ViewUserDto } from '../users/dto/view-user.dto';
import { LoginDto } from './dto/login.dto';
import { LoginCommand } from './usecases/commands/login.command';
import { SessionDto } from './dto/session.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  @ApiCreatedResponse({ type: ViewUserDto })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async register(@Body() data: CreateUserDto): Promise<ViewUserDto> {
    return this.commandBus.execute(new RegisterCommand(data));
  }

  @Post('login')
  @ApiCreatedResponse({ type: SessionDto })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials' })
  async login(@Body() data: LoginDto): Promise<SessionDto> {
    return this.commandBus.execute(new LoginCommand(data));
  }
}
