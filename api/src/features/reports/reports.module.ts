import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsQueryRepository } from './database/reports.query-repository';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [ReportsController],
  providers: [ReportsQueryRepository],
})
export class ReportsModule {}
