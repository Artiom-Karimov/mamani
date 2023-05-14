import { OperationType } from '../entities/operation-type';
import { Operation } from '../entities/operation.entity';

export class ViewOperationDto {
  id: string;
  accountId: string;
  createdAt: string;
  description?: string;
  amount: number;
  type: OperationType;
  categoryId: string;

  constructor(model?: Operation) {
    if (!model) return;

    this.id = model.id;
    this.accountId = model.accountId;
    this.createdAt = model.createdAt.toISOString();
    this.description = model.description;
    this.amount = model.number;
    this.type = model.type;
    this.categoryId = model.categoryId;
  }
}
