import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoriesRepository } from './database/categories.repository';
import { CategoriesQueryRepository } from './database/categories.query.repository';
import { UsersModule } from '../users/users.module';
import { CreateCategoryHandler } from './usecases/handlers/create-category.handler';
import { UpdateCategoryHandler } from './usecases/handlers/update-category.handler';
import { DeleteCategoryHandler } from './usecases/handlers/delete-category.handler';
import { GetCategoryHandler } from './usecases/handlers/get-category.handler';

const handlers = [
  CreateCategoryHandler,
  UpdateCategoryHandler,
  DeleteCategoryHandler,
  GetCategoryHandler,
];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Category]), UsersModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    CategoriesRepository,
    CategoriesQueryRepository,
    ...handlers,
  ],
})
export class CategoriesModule {}
