import { Account } from '../entities/account.entity';

export class ViewAccountDto {
  id: string;
  userId: string;
  name: string;
  description?: string;
  default: boolean;
  color?: string;
  createdAt: Date;

  constructor(model: Account) {
    this.id = model.id;
    this.userId = model.userId;
    this.name = model.name;
    this.description = model.description;
    this.default = model.default;
    this.color = model.color;
    this.createdAt = model.createdAt;
  }
}
