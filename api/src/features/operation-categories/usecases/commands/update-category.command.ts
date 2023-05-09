import { UpdateCategoryDto } from '../../dto/update-category.dto';

export class UpdateCategoryCommand {
  constructor(
    public id: string,
    public data: UpdateCategoryDto,
    public userId: string,
  ) {}
}
