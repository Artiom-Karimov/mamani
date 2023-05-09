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
