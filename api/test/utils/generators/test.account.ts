import { CreateAccountDto } from '../../../src/features/accounts/dto/create-account.dto';
import { TestUser } from './test.user';
import * as request from 'supertest';

export class TestAccount extends CreateAccountDto {
  public id: string | undefined;
  public readonly user: TestUser;

  public get token(): string | undefined {
    return this.user?.token;
  }

  private static counter = 0;
  public static readonly accounts: TestAccount[] = [];

  constructor(
    private readonly server: any,
    user?: TestUser,
  ) {
    super();

    if (user) this.user = user;
    else this.user = new TestUser(server);

    this.name = `account-${TestAccount.counter}`;
    this.description = `${this.user.firstName}.${this.name}`;

    TestAccount.counter++;
    TestAccount.accounts.push(this);
  }

  /** Create [amount] accounts without sending to db */
  static generate(server: any, user: TestUser, amount: number): void {
    for (let i = 0; i < amount; i++) new TestAccount(server, user);
  }

  /** Remove all entries from accounts array */
  static clear(): void {
    TestAccount.accounts.splice(0, TestAccount.accounts.length);
  }

  static async sendAlToDb(): Promise<void> {
    for (const account of TestAccount.accounts) {
      await account.sendToDb();
    }
  }

  async sendToDb(): Promise<void> {
    if (this.id) return;
    if (!this.user.id) await this.user.register();
    if (!this.token) await this.user.login();

    const res = await request(this.server)
      .post('/accounts')
      .set('authorization', `Bearer ${this.token}`)
      .send(this)
      .expect(201);

    this.id = res.body.id;
  }
}
