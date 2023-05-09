import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoriesRepository } from './database/categories.repository';
import { CategoriesQueryRepository } from './database/categories.query.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Category]), UsersModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    CategoriesRepository,
    CategoriesQueryRepository,
  ],
})
export class CategoriesModule {}
