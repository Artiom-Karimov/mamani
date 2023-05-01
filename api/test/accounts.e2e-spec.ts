import { CreateAccountDto } from '../src/features/accounts/dto/create-account.dto';
import { expressions } from '../src/shared/models/regex';
import { TestUser } from './utils/generators/test.user';
import { TestApp } from './utils/test.app';
import * as request from 'supertest';

describe('AccountsController (e2e)', () => {
  let app: TestApp;

  beforeAll(async () => {
    app = new TestApp();
    await app.start();
    await app.clearAllData();

    TestUser.clear();
    TestUser.generate(app.server, 2);
    await TestUser.RegisterAndLoginAll();
  });

  afterAll(async () => {
    await app.stop();
  });

  it('All operations without auth should fail', async () => {
    const promises = [
      request(app.server).get('/accounts/'),
      request(app.server).get('/accounts/4553'),
      request(app.server).post('/accounts/').send('data'),
      request(app.server).patch('/accounts/3656').send('data'),
      request(app.server).delete('/accounts/3656'),
    ];
    const responses = await Promise.all(promises);
    for (const res of responses) {
      expect(res.status).toBe(401);
    }
  });

  let user1: TestUser;
  it('User should not have accounts', async () => {
    user1 = TestUser.users[0];
    const response = await request(app.server)
      .get('/accounts')
      .set('Authorization', `Bearer ${user1.token}`)
      .expect(200);

    expect(response.body).toEqual([]);
  });

  let accountId: string;
  const accountData: CreateAccountDto = {
    name: 'Thats Mamani',
    description: 'Counting-accounting',
    color: '#0099ff',
  };

  let account2Id: string;
  const account2Data: CreateAccountDto = {
    name: 'Education account',
    color: '#00aa00',
  };

  it('User should be able to create accounts', async () => {
    let response = await request(app.server)
      .post('/accounts')
      .send(accountData)
      .set('Authorization', `Bearer ${user1.token}`)
      .expect(201);

    expect(response.body).toEqual({
      ...accountData,
      default: false,
      userId: user1.id,
      id: expect.stringMatching(expressions.uuid),
      createdAt: expect.stringMatching(expressions.isoDate),
    });

    accountId = response.body.id;

    response = await request(app.server)
      .post('/accounts')
      .send(account2Data)
      .set('Authorization', `Bearer ${user1.token}`)
      .expect(201);

    expect(response.body).toEqual({
      ...account2Data,
      default: false,
      userId: user1.id,
      description: null,
      id: expect.stringMatching(expressions.uuid),
      createdAt: expect.stringMatching(expressions.isoDate),
    });

    account2Id = response.body.id;
  });

  it('User should get his accounts', async () => {
    let response = await request(app.server)
      .get(`/accounts/${accountId}`)
      .set('Authorization', `Bearer ${user1.token}`)
      .expect(200);

    expect(response.body).toEqual({
      ...accountData,
      default: false,
      userId: user1.id,
      id: expect.stringMatching(expressions.uuid),
      createdAt: expect.stringMatching(expressions.isoDate),
    });

    response = await request(app.server)
      .get(`/accounts`)
      .set('Authorization', `Bearer ${user1.token}`)
      .expect(200);

    expect(response.body).toEqual([
      {
        ...account2Data,
        description: null,
        id: account2Id,
        default: false,
        userId: user1.id,
        createdAt: expect.stringMatching(expressions.isoDate),
      },
      {
        ...accountData,
        id: accountId,
        default: false,
        userId: user1.id,
        createdAt: expect.stringMatching(expressions.isoDate),
      },
    ]);
  });

  let user2: TestUser;
  it('user2 should not get user1 account', async () => {
    user2 = TestUser.users[1];
    const response = await request(app.server)
      .get(`/accounts/${accountId}`)
      .set('Authorization', `Bearer ${user2.token}`)
      .expect(403);
  });

  let user2AccountId: string;
  const user2Account: CreateAccountDto = {
    name: 'Cryptocurrency',
    description: 'Lots of <mani>',
    color: '#000000',
  };
  it('User2 should be able to create account', async () => {
    const response = await request(app.server)
      .post('/accounts')
      .send(user2Account)
      .set('Authorization', `Bearer ${user2.token}`)
      .expect(201);

    expect(response.body).toEqual({
      ...user2Account,
      default: false,
      userId: user2.id,
      id: expect.stringMatching(expressions.uuid),
      createdAt: expect.stringMatching(expressions.isoDate),
    });

    user2AccountId = response.body.id;
  });

  it('User should be able to update account', async () => {
    accountData.name = 'Salary';

    let response = await request(app.server)
      .patch(`/accounts/${accountId}`)
      .send({ name: accountData.name })
      .set('Authorization', `Bearer ${user1.token}`)
      .expect(200);

    expect(response.body).toEqual({
      ...accountData,
      default: false,
      userId: user1.id,
      id: expect.stringMatching(expressions.uuid),
      createdAt: expect.stringMatching(expressions.isoDate),
    });

    response = await request(app.server)
      .get(`/accounts/${accountId}`)
      .set('Authorization', `Bearer ${user1.token}`)
      .expect(200);

    expect(response.body).toEqual({
      ...accountData,
      default: false,
      userId: user1.id,
      id: expect.stringMatching(expressions.uuid),
      createdAt: expect.stringMatching(expressions.isoDate),
    });
  });

  it('Another account should not be changed', async () => {
    const response = await request(app.server)
      .get(`/accounts/${user2AccountId}`)
      .set('Authorization', `Bearer ${user2.token}`)
      .expect(200);

    expect(response.body).toEqual({
      ...user2Account,
      default: false,
      userId: user2.id,
      id: expect.stringMatching(expressions.uuid),
      createdAt: expect.stringMatching(expressions.isoDate),
    });
  });

  it('User2 should not be able to delete user1 account', async () => {
    const response = await request(app.server)
      .delete(`/accounts/${accountId}`)
      .set('Authorization', `Bearer ${user2.token}`)
      .expect(403);
  });

  it('User1 should delete his account', async () => {
    await request(app.server)
      .delete(`/accounts/${accountId}`)
      .set('Authorization', `Bearer ${user1.token}`)
      .expect(204);

    await request(app.server)
      .get(`/accounts/${accountId}`)
      .set('Authorization', `Bearer ${user1.token}`)
      .expect(404);
  });

  it('User2 account should stay undeleted', async () => {
    const response = await request(app.server)
      .get(`/accounts/${user2AccountId}`)
      .set('Authorization', `Bearer ${user2.token}`)
      .expect(200);

    expect(response.body).toEqual({
      ...user2Account,
      default: false,
      userId: user2.id,
      id: expect.stringMatching(expressions.uuid),
      createdAt: expect.stringMatching(expressions.isoDate),
    });
  });

  it('User1 account2 should stay undeleted', async () => {
    const response = await request(app.server)
      .get(`/accounts/${account2Id}`)
      .set('Authorization', `Bearer ${user1.token}`)
      .expect(200);

    expect(response.body).toEqual({
      ...account2Data,
      description: null,
      id: account2Id,
      default: false,
      userId: user1.id,
      createdAt: expect.stringMatching(expressions.isoDate),
    });
  });
});
