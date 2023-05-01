import { CreateUserDto } from '../../../src/features/users/dto/create-user.dto';
import * as request from 'supertest';

export class TestUser extends CreateUserDto {
  public id: string | undefined;
  public token: string | undefined;

  private static counter = 0;

  constructor() {
    super();
    const name = `user-${TestUser.counter}`;
    this.email = `${name}@example.com`;
    this.firstName = name;
    this.lastName = `${name}-last`;
    this.password = `${name}-pass`;

    TestUser.counter++;
  }

  async register(server: any): Promise<void> {
    const res = await request(server)
      .post('/auth/register')
      .send(this)
      .expect(201);

    this.id = res.body.id;
  }

  async login(server: any): Promise<string | undefined> {
    const res = await request(server)
      .post('/auth/login')
      .send({ email: this.email, password: this.password })
      .expect(201);

    this.token = res.body.token;
    return this.token;
  }
}
