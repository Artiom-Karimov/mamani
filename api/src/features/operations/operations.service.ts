import { BadRequestException, Injectable } from '@nestjs/common';
import { OperationError } from './entities/operation-error';
import { Operation } from './entities/operation.entity';
import { OperationsRepository } from './database/operations.repository';

@Injectable()
export class OperationsService {
  constructor(private readonly repo: OperationsRepository) {}

  async save(operation: Operation): Promise<string> {
    const id = await this.repo.createOrUpdate(operation);
    if (!id) throw new BadRequestException('Cannot save operation');
    return id;
  }

  errorText(code: OperationError): string {
    switch (code) {
      case OperationError.ForeignCategory:
        return 'Category belongs to another user';
      case OperationError.IllegalAmount:
        return 'Illegal amount';
      case OperationError.NotEnoughData:
        return 'Error retrieving data';
      default:
        return 'Unknown error';
    }
  }
}
