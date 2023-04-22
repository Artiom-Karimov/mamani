import { Injectable } from '@nestjs/common';
import { CreateOperationCategoryDto } from './dto/create-operation-category.dto';
import { UpdateOperationCategoryDto } from './dto/update-operation-category.dto';

@Injectable()
export class OperationCategoriesService {
  create(createOperationCategoryDto: CreateOperationCategoryDto) {
    return 'This action adds a new operationCategory';
  }

  findAll() {
    return `This action returns all operationCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} operationCategory`;
  }

  update(id: number, updateOperationCategoryDto: UpdateOperationCategoryDto) {
    return `This action updates a #${id} operationCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} operationCategory`;
  }
}
