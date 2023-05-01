import { Module } from '@nestjs/common';
import { OperationCategoriesService } from './operation-categories.service';
import { OperationCategoriesController } from './operation-categories.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationCategory } from './entities/operation-category.entity';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([OperationCategory])],
  controllers: [OperationCategoriesController],
  providers: [OperationCategoriesService],
})
export class OperationCategoriesModule {}
