import { CreateAccountDto } from '../src/features/accounts/dto/create-account.dto';
import { expressions } from '../src/shared/models/regex';
import { TestAccount } from './utils/generators/test.account';
import { TestCategory } from './utils/generators/test.category';
import { TestUser } from './utils/generators/test.user';
import { TestApp } from './utils/test.app';
import * as request from 'supertest';

type UserData = {
  user: TestUser;
  accounts: TestAccount[];
  categories: TestCategory[];
};

describe('OperationsController (e2e)', () => {
  let app: TestApp;
  let user1: UserData;

  beforeAll(async () => {
    app = new TestApp();
    await app.start();
    await app.clearAllData();

    TestUser.clear();
    TestUser.generate(app.server, 2);
    await TestUser.RegisterAndLoginAll();

    user1 = {
      user: TestUser.users[0],
      accounts: [],
      categories: [],
    };

    TestAccount.clear();
    TestAccount.generate(app.server, user1.user, 2);
    await TestAccount.sendAlToDb();
    user1.accounts = [...TestAccount.accounts];

    TestCategory.clear();
    TestCategory.generate(app.server, user1.user, 2);
    await TestCategory.sendAlToDb();
    user1.categories = [...TestCategory.categories];
  });

  afterAll(async () => {
    await app.stop();
  });

  it('All operations without auth should fail', async () => {
    const promises = [
      request(app.server).get('/operations/'),
      request(app.server).get('/operations/4553'),
      request(app.server).post('/operations/').send('data'),
      request(app.server).patch('/operations/3656').send('data'),
      request(app.server).delete('/operations/3656'),
    ];
    const responses = await Promise.all(promises);
    for (const res of responses) {
      expect(res.status).toBe(401);
    }
  });

  it('User should not have operations', async () => {
    const response = await request(app.server)
      .get('/operations')
      .set('Authorization', `Bearer ${user1.user.token}`)
      .expect(200);

    expect(response.body).toEqual({
      page: 1,
      pageSize: 20,
      pagesTotal: 0,
      elementsTotal: 0,
      elements: [],
    });
  });
});
