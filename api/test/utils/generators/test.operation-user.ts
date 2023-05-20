import { ViewOperationDto } from '../../../src/features/operations/dto/view-operation.dto';
import { TestAccount } from './test.account';
import { TestCategory } from './test.category';
import { TestUser } from './test.user';

export class TestOperationUser {
  user: TestUser = new TestUser(this.server);
  accounts: TestAccount[] = [];
  categories: TestCategory[] = [];
  operations: ViewOperationDto[] = [];

  constructor(private readonly server: any) {}

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

  async createCategories(amount: number): Promise<TestOperationUser> {
    for (let i = 0; i < amount; i++) {
      const category = new TestCategory(this.server, this.user);
      await category.sendToDb();
      this.categories.push(category);
    }
    return this;
  }
}
