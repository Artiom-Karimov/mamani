import { OperationType } from '../entities/operation-type';

export class ViewOperationDto {
  id: string;
  accountId: string;
  createdAt: string;
  description?: string;
  amount: string;
  type: OperationType;
  categoryId?: string;
}
