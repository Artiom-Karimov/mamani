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
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
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
import { AuthGuard } from '../../shared/guards/auth.guard';
import { ViewCategoryDto } from './dto/view-category.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCategoryCommand } from './usecases/commands/create-category.command';
import { ViewUserDto } from '../users/dto/view-user.dto';
import { User } from '../../shared/decorators/user.decorator';
import { UpdateCategoryCommand } from './usecases/commands/update-category.command';
import { DeleteCategoryCommand } from './usecases/commands/delete-category.command';
import { CategoriesQueryRepository } from './database/categories.query.repository';

@ApiTags('operation categories')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('categories')
@UseGuards(AuthGuard)
export class CategoriesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryRepo: CategoriesQueryRepository,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new operation category for current user' })
  @ApiCreatedResponse({
    description: 'Success, returns created category',
    type: ViewCategoryDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async create(
    @Body() data: CreateCategoryDto,
    @User() user: ViewUserDto,
  ): Promise<ViewCategoryDto> {
    const id = await this.commandBus.execute(
      new CreateCategoryCommand(data, user.id),
    );
    return this.getOne(id, user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all current user categories including common ones',
  })
  async findAll(@User() user: ViewUserDto): Promise<ViewCategoryDto[]> {
    return this.queryRepo.getByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get category by id',
  })
  @ApiForbiddenResponse({ description: 'Category belongs to another user' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async findOne(
    @Param('id') id: string,
    @User() user: ViewUserDto,
  ): Promise<ViewCategoryDto> {
    return this.getOne(id, user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update category' })
  @ApiOkResponse({
    description: 'Success, returns updated category',
    type: ViewCategoryDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiForbiddenResponse({ description: 'Category belongs to another user' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateCategoryDto,
    @User() user: ViewUserDto,
  ): Promise<ViewCategoryDto> {
    const result = await this.commandBus.execute(
      new UpdateCategoryCommand(id, data, user.id),
    );
    return this.getOne(result, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete category' })
  @ApiNoContentResponse({ description: 'Success' })
  @ApiForbiddenResponse({ description: 'Category belongs to another user' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async remove(
    @Param('id') id: string,
    @User() user: ViewUserDto,
  ): Promise<void> {
    return this.commandBus.execute(new DeleteCategoryCommand(id, user.id));
  }

  private async getOne(id: string, userId: string): Promise<ViewCategoryDto> {
    const result = await this.queryRepo.get(id);
    if (!result) throw new NotFoundException('Category not found');

    if (result.userId && result.userId !== userId)
      throw new ForbiddenException('Category belongs to another user');

    return result;
  }
}
