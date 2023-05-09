import { OperationType } from '../../operations/entities/operation-type';
import { Category } from '../entities/category.entity';

export class ViewCategoryDto {
  id: string;
  type: OperationType;
  name: string;
  description?: string;
  color?: string;
  userId?: string;
  parentId?: string;
  children?: ViewCategoryDto[];

  constructor(model?: Category) {
    if (!model) return;

    this.id = model.id;
    this.type = model.type;
    this.name = model.name;
    this.description = model.description;
    this.color = model.color;
    this.userId = model.userId;
    this.parentId = model.parentId;
    this.children = model.children;
  }

  static removeChildrenFromList(models: ViewCategoryDto[]): ViewCategoryDto[] {
    const childIds = new Array<string>();

    for (const model of models) {
      if (!model.children || !model.children.length) continue;
      const ids = model.children.map((c) => c.id);
      childIds.push(...ids);
    }

    return models.filter((m) => !childIds.includes(m.id));
  }
}
