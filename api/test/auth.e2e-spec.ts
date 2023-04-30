import { TestApp } from './utils/test.app';
import * as request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: TestApp;

  beforeAll(async () => {
    app = new TestApp();
    await app.start();
    await app.clearAllData();
  });

  afterAll(async () => {
    await app.stop();
  });

  it('Login should fail', async () => {
    await request(app.server)
      .post('/auth/login')
      .send({ email: 'noname@example.com', password: 'examplePass' })
      .expect(401);
  });
});
