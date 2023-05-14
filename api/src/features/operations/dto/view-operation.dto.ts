import { OperationType } from '../entities/operation-type';
import { Operation } from '../entities/operation.entity';

export class ViewOperationDto {
  id: string;
  accountId: string;
  accountName?: string;
  createdAt: string;
  description?: string;
  amount: number;
  type: OperationType;
  categoryId: string;
  categoryName?: string;

  constructor(model?: Operation) {
    if (!model) return;

    this.id = model.id;
    this.accountId = model.accountId;
    this.accountName = model.account?.name;
    this.createdAt = model.createdAt.toISOString();
    this.description = model.description;
    this.amount = model.number;
    this.type = model.type;
    this.categoryId = model.categoryId;
    this.categoryName = model.category?.name;
  }
}
