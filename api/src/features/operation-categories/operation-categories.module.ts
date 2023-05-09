import { Module } from '@nestjs/common';
import { OperationCategoriesService } from './operation-categories.service';
import { OperationCategoriesController } from './operation-categories.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationCategory } from './entities/operation-category.entity';
import { CategoriesRepository } from './database/categories.repository';
import { CategoriesQueryRepository } from './database/categories.query.repository';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([OperationCategory])],
  controllers: [OperationCategoriesController],
  providers: [
    OperationCategoriesService,
    CategoriesRepository,
    CategoriesQueryRepository,
  ],
})
export class OperationCategoriesModule {}
