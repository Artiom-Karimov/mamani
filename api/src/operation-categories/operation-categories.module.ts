import { Module } from '@nestjs/common';
import { OperationCategoriesService } from './operation-categories.service';
import { OperationCategoriesController } from './operation-categories.controller';

@Module({
  controllers: [OperationCategoriesController],
  providers: [OperationCategoriesService]
})
export class OperationCategoriesModule {}
