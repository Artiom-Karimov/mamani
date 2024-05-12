import { CreateOperationDto } from '../../../src/features/operations/dto/create-operation.dto';
import { ViewOperationDto } from '../../../src/features/operations/dto/view-operation.dto';
import { OperationType } from '../../../src/features/operations/entities/operation-type';
import { TestAccount } from './test.account';
import { TestCategory } from './test.category';
import { TestUser } from './test.user';
import * as request from 'supertest';

export class TestOperationUser {
  user: TestUser;
  accounts: TestAccount[] = [];
  categories: TestCategory[] = [];
  operations: ViewOperationDto[] = [];

  get token(): string | undefined {
    return this.user.token;
  }

  constructor(private readonly server: any) {
    this.user = new TestUser(this.server);
  }

  static async create(server: any): Promise<TestOperationUser> {
    const result = new TestOperationUser(server);

    await result.user.register();
    await result.user.login();

    return result;
  }

  async createAccounts(amount: number): Promise<TestOperationUser> {
    for (let i = 0; i < amount; i++) {
      const account = new TestAccount(this.server, this.user);
      await account.sendToDb();
      this.accounts.push(account);
    }
    return this;
  }

  async createCategories(
    amount: number,
    type?: OperationType,
  ): Promise<TestOperationUser> {
    for (let i = 0; i < amount; i++) {
      const category = new TestCategory(this.server, this.user, type);
      await category.sendToDb();
      this.categories.push(category);
    }
    return this;
  }

  async createOperation(
    account: TestAccount,
    category: TestCategory,
    amount: number,
    description?: string,
  ): Promise<ViewOperationDto> {
    const data: CreateOperationDto = {
      accountId: account.id!,
      categoryId: category.id!,
      amount,
      description,
    };

    const response = await request(this.server)
      .post('/operations')
      .set('Authorization', `Bearer ${this.token}`)
      .send(data)
      .expect(201);

    this.operations.push(response.body);
    return response.body;
  }
}
