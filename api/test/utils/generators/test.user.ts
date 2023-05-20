import { CreateUserDto } from '../../../src/features/users/dto/create-user.dto';
import * as request from 'supertest';

export class TestUser extends CreateUserDto {
  public id: string | undefined;
  public token: string | undefined;

  private static counter = 0;
  public static readonly users: TestUser[] = [];

  constructor(private readonly server: any) {
    super();
    const name = `user-${TestUser.counter}`;
    this.email = `${name}@example.com`;
    this.firstName = name;
    this.lastName = `${name}-last`;
    this.password = `${name}-pass`;

    TestUser.counter++;
    TestUser.users.push(this);
  }

  /** Create [amount] users without sending to db */
  static generate(server: any, amount: number): void {
    for (let i = 0; i < amount; i++) new TestUser(server);
  }

  /** Remove all entries from users array */
  static clear(): void {
    TestUser.users.splice(0, TestUser.users.length);
  }

  static async RegisterAndLoginAll(): Promise<void> {
    for (const user of TestUser.users) {
      await user.register();
      await user.login();
    }
  }

  async register(): Promise<void> {
    if (this.id) return;

    const res = await request(this.server)
      .post('/auth/register')
      .send(this)
      .expect(201);

    this.id = res.body.id;
  }

  async login(): Promise<string | undefined> {
    const res = await request(this.server)
      .post('/auth/login')
      .send({ email: this.email, password: this.password })
      .expect(201);

    this.token = res.body.token;
    return this.token;
  }
}
