import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterCommand } from './usecases/commands/register.command';
import { ViewUserDto } from '../users/dto/view-user.dto';
import { LoginDto } from './dto/login.dto';
import { LoginCommand } from './usecases/commands/login.command';
import { SessionDto } from './dto/session.dto';
import { GetUserQuery } from '../users/usecases/queries/get-user.query';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { User } from '../../shared/decorators/user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('register')
  @ApiCreatedResponse({ type: ViewUserDto })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async register(@Body() data: CreateUserDto): Promise<ViewUserDto> {
    const id = await this.commandBus.execute(new RegisterCommand(data));
    return this.queryBus.execute(new GetUserQuery(id));
  }

  @Post('login')
  @ApiCreatedResponse({ type: SessionDto })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials' })
  async login(@Body() data: LoginDto): Promise<SessionDto> {
    return this.commandBus.execute(new LoginCommand(data));
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: ViewUserDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
  async getCurrentUser(@User() user: ViewUserDto): Promise<ViewUserDto> {
    return user;
  }
}
