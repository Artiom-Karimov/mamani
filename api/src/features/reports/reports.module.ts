import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsQueryRepository } from './database/reports.query-repository';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation } from '../operations/entities/operation.entity';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Operation])],
  controllers: [ReportsController],
  providers: [ReportsQueryRepository],
})
export class ReportsModule {}
