import { CreateCategoryDto } from '../../../src/features/operation-categories/dto/create-category.dto';
import { OperationType } from '../../../src/features/operations/entities/operation-type';
import { TestUser } from './test.user';
import * as request from 'supertest';

export class TestCategory extends CreateCategoryDto {
  public id: string | undefined;
  public readonly user: TestUser;

  public get token(): string | undefined {
    return this.user?.token;
  }

  private static counter = 0;
  public static readonly categories: TestCategory[] = [];

  constructor(
    private readonly server: any,
    user?: TestUser,
    type?: OperationType,
  ) {
    super();

    if (user) this.user = user;
    else this.user = new TestUser(server);

    this.type = type || OperationType.Income;
    this.name = `category-${TestCategory.counter}`;
    this.description = `${this.user.firstName}.${this.name}`;

    TestCategory.counter++;
    TestCategory.categories.push(this);
  }

  /** Create [amount] categories without sending to db */
  static generate(server: any, user: TestUser, amount: number): void {
    for (let i = 0; i < amount; i++) new TestCategory(server, user);
  }

  /** Remove all entries from accounts array */
  static clear(): void {
    TestCategory.categories.splice(0, TestCategory.categories.length);
  }

  static async sendAlToDb(): Promise<void> {
    for (const category of TestCategory.categories) {
      await category.sendToDb();
    }
  }

  async sendToDb(): Promise<void> {
    if (this.id) return;
    if (!this.user.id) await this.user.register();
    if (!this.token) await this.user.login();

    const res = await request(this.server)
      .post('/categories')
      .set('authorization', `Bearer ${this.token}`)
      .send(this)
      .expect(201);

    this.id = res.body.id;
  }
}
