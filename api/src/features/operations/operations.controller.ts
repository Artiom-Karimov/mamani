import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { User } from '../../shared/decorators/user.decorator';
import { ViewUserDto } from '../users/dto/view-user.dto';
import { CreateOperationCommand } from './usecases/commands/create-operation.command';
import { ViewOperationDto } from './dto/view-operation.dto';
import { UpdateOperationCommand } from './usecases/commands/update-operation.command';
import { DeleteOperationCommand } from './usecases/commands/delete-operation.command';
import { OperationsQueryRepository } from './database/operations.query.repository';
import { OperationPageDto } from './dto/operation-page.dto';
import { OperationsQueryDto } from './dto/operations.query.dto';

@ApiTags('operations')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('operations')
@UseGuards(AuthGuard)
export class OperationsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryRepo: OperationsQueryRepository,
  ) {}

  @Post()
  async create(
    @Body() data: CreateOperationDto,
    @User() user: ViewUserDto,
  ): Promise<ViewOperationDto> {
    const id = await this.commandBus.execute(
      new CreateOperationCommand(data, user.id),
    );
    return this.getOne(id, user.id);
  }

  @Get()
  async findAll(
    @Query() query: OperationsQueryDto,
    @User() user: ViewUserDto,
  ): Promise<OperationPageDto> {
    return this.queryRepo.findMany(query, user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @User() user: ViewUserDto,
  ): Promise<ViewOperationDto> {
    return this.getOne(id, user.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateOperationDto,
    @User() user: ViewUserDto,
  ): Promise<ViewOperationDto> {
    await this.commandBus.execute(
      new UpdateOperationCommand(id, data, user.id),
    );
    return this.getOne(id, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @User() user: ViewUserDto): Promise<void> {
    return this.commandBus.execute(new DeleteOperationCommand(id, user.id));
  }

  private async getOne(id: string, userId: string): Promise<ViewOperationDto> {
    const result = await this.queryRepo.findOne(id, userId);
    if (!result) throw new NotFoundException('Operation not found');
    return result;
  }
}
