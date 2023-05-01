import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../../shared/decorators/user.decorator';
import { ViewUserDto } from '../users/dto/view-user.dto';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAccountCommand } from './usecases/commands/create-account.command';
import { GetAccountQuery } from './usecases/queries/get-account.query';
import { ViewAccountDto } from './dto/view-account.dto';
import { GetUserAccountsQuery } from './usecases/queries/get-user-accounts.query';
import { UpdateAccountCommand } from './usecases/commands/update-account.command';
import { DeleteAccountCommand } from './usecases/commands/delete-account.command';

@ApiTags('accounts')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('accounts')
@UseGuards(AuthGuard)
export class AccountsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() data: CreateAccountDto,
    @User() user: ViewUserDto,
  ): Promise<ViewAccountDto> {
    const id = await this.commandBus.execute(
      new CreateAccountCommand(user.id, data),
    );
    return this.queryBus.execute(new GetAccountQuery(id, user.id));
  }

  @Get()
  async findAll(@User() user: ViewUserDto): Promise<ViewAccountDto[]> {
    return this.queryBus.execute(new GetUserAccountsQuery(user.id));
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @User() user: ViewUserDto,
  ): Promise<ViewAccountDto> {
    return this.queryBus.execute(new GetAccountQuery(id, user.id));
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateAccountDto,
    @User() user: ViewUserDto,
  ): Promise<ViewAccountDto> {
    await this.commandBus.execute(new UpdateAccountCommand(id, data, user.id));
    return this.queryBus.execute(new GetAccountQuery(id, user.id));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @User() user: ViewUserDto,
  ): Promise<void> {
    return this.commandBus.execute(new DeleteAccountCommand(id, user.id));
  }
}
