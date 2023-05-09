import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty({
    type: [ViewCategoryDto],
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: OperationType.Income,
        name: 'Salary',
        description: 'Thats how I get mamani',
        color: '#eeeeee',
        userId: '123e4567-e89b-12d3-a456-426614174000',
      },
    ],
  })
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

  static moveChildrenIntoParents(models: ViewCategoryDto[]): void {
    for (let i = 0; i < models.length; i++) {
      const child = models[i];
      if (!child.parentId) continue;

      const parent = models.find((m) => m.id === child.parentId);
      if (!parent) continue;

      if (!parent.children) parent.children = [];
      parent.children.push(child);
      models.splice(i, 1);
      i--;
    }
  }
}
