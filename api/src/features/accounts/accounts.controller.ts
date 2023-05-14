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
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../../shared/decorators/user.decorator';
import { ViewUserDto } from '../users/dto/view-user.dto';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateAccountCommand } from './usecases/commands/create-account.command';
import { ViewAccountDto } from './dto/view-account.dto';
import { UpdateAccountCommand } from './usecases/commands/update-account.command';
import { DeleteAccountCommand } from './usecases/commands/delete-account.command';
import { AccountsQueryRepository } from './database/accounts.query.repository';

@ApiTags('accounts')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('accounts')
@UseGuards(AuthGuard)
export class AccountsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryRepo: AccountsQueryRepository,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new account for current user' })
  @ApiCreatedResponse({
    description: 'Success, returns created account',
    type: ViewAccountDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async create(
    @Body() data: CreateAccountDto,
    @User() user: ViewUserDto,
  ): Promise<ViewAccountDto> {
    const id = await this.commandBus.execute(
      new CreateAccountCommand(user.id, data),
    );
    return this.getOne(id, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all current user accounts' })
  async findAll(@User() user: ViewUserDto): Promise<ViewAccountDto[]> {
    return this.queryRepo.getByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account' })
  @ApiForbiddenResponse({ description: 'Account belongs to another user' })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async findOne(
    @Param('id') id: string,
    @User() user: ViewUserDto,
  ): Promise<ViewAccountDto> {
    return this.getOne(id, user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update account' })
  @ApiOkResponse({
    description: 'Success, returns updated account',
    type: ViewAccountDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiForbiddenResponse({ description: 'Account belongs to another user' })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateAccountDto,
    @User() user: ViewUserDto,
  ): Promise<ViewAccountDto> {
    await this.commandBus.execute(new UpdateAccountCommand(id, data, user.id));
    return this.getOne(id, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete account' })
  @ApiNoContentResponse({ description: 'Success' })
  @ApiForbiddenResponse({ description: 'Account belongs to another user' })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async remove(
    @Param('id') id: string,
    @User() user: ViewUserDto,
  ): Promise<void> {
    return this.commandBus.execute(new DeleteAccountCommand(id, user.id));
  }

  private async getOne(id: string, userId: string): Promise<ViewAccountDto> {
    const result = await this.queryRepo.get(id);
    if (!result) throw new NotFoundException('Account not found');

    if (result.userId !== userId)
      throw new ForbiddenException("You cannot get someone else's account");

    return result;
  }
}
