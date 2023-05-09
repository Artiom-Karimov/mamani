import { OperationType } from '../../operations/entities/operation-type';
import { OperationCategory } from '../entities/operation-category.entity';

export class ViewOperationCategoryDto {
  id: string;
  type: OperationType;
  name: string;
  description?: string;
  color?: string;
  userId?: string;
  parentId?: string;

  constructor(model?: OperationCategory) {
    if (!model) return;

    this.id = model.id;
    this.type = model.type;
    this.name = model.name;
    this.description = model.description;
    this.color = model.color;
    this.userId = model.userId;
    this.parentId = model.parentId;
  }
}
