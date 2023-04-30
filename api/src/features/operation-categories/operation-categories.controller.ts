import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OperationCategoriesService } from './operation-categories.service';
import { CreateOperationCategoryDto } from './dto/create-operation-category.dto';
import { UpdateOperationCategoryDto } from './dto/update-operation-category.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('operation categories')
@Controller('operation-categories')
export class OperationCategoriesController {
  constructor(
    private readonly operationCategoriesService: OperationCategoriesService,
  ) {}

  @Post()
  create(@Body() createOperationCategoryDto: CreateOperationCategoryDto) {
    return this.operationCategoriesService.create(createOperationCategoryDto);
  }

  @Get()
  findAll() {
    return this.operationCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.operationCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOperationCategoryDto: UpdateOperationCategoryDto,
  ) {
    return this.operationCategoriesService.update(
      +id,
      updateOperationCategoryDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.operationCategoriesService.remove(+id);
  }
}
