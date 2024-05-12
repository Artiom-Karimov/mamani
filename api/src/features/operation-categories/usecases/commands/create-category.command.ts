import { CreateCategoryDto } from '../../dto/create-category.dto';

export class CreateCategoryCommand {
  constructor(
    public data: CreateCategoryDto,
    public userId: string,
  ) {}
}
