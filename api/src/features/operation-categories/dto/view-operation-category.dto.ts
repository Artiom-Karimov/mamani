import { OperationType } from '../../operations/entities/operation-type';

export class ViewOperationCategoryDto {
  id: string;
  type: OperationType;
  name: string;
  description?: string;
  color?: string;
  parentId?: string;
}
