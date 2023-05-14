import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { OperationsRepository } from './database/operations.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation } from './entities/operation.entity';
import { CreateOperationHandler } from './usecases/handlers/create-operation.handler';
import { UpdateOperationHandler } from './usecases/handlers/update-operation.handler';
import { DeleteOperationHandler } from './usecases/handlers/delete-operation.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { OperationsQueryRepository } from './database/operations.query.repository';

const handlers = [
  CreateOperationHandler,
  UpdateOperationHandler,
  DeleteOperationHandler,
];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Operation])],
  controllers: [OperationsController],
  providers: [
    OperationsService,
    OperationsRepository,
    OperationsQueryRepository,
    ...handlers,
  ],
})
export class OperationsModule {}
