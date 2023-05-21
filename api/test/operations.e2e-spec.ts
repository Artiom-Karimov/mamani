import { CreateOperationDto } from '../src/features/operations/dto/create-operation.dto';
import { UpdateOperationDto } from '../src/features/operations/dto/update-operation.dto';
import { expressions } from '../src/shared/models/regex';
import { TestOperationUser } from './utils/generators/test.operation-user';
import { TestApp } from './utils/test.app';
import * as request from 'supertest';

describe('OperationsController (e2e)', () => {
  let app: TestApp;
  let user1: TestOperationUser;
  let user2: TestOperationUser;

  beforeAll(async () => {
    app = new TestApp();
    await app.start();
    await app.clearAllData();

    user1 = await TestOperationUser.create(app.server);
    await user1.createAccounts(2);
    await user1.createCategories(2);

    user2 = await TestOperationUser.create(app.server);
    await user2.createAccounts(1);
    await user2.createCategories(1);
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

  it('Get with inexisting id should get 404', async () => {
    await request(app.server)
      .get(`/operations/998b5ece-3f1f-43af-98aa-be61ebf9898e`)
      .set('Authorization', `Bearer ${user1.user.token}`)
      .expect(404);
  });

  it('Operation with invalid amount should not be created', async () => {
    const data: CreateOperationDto = {
      accountId: user1.accounts[0].id!,
      categoryId: user1.categories[0].id!,
      amount: -63,
    };

    await request(app.server)
      .post('/operations')
      .set('Authorization', `Bearer ${user1.user.token}`)
      .send(data)
      .expect(400);
  });

  it('Operation without account or category should not be created', async () => {
    let data: any = {
      accountId: '',
      categoryId: user1.categories[0].id!,
      amount: 12,
    };

    await request(app.server)
      .post('/operations')
      .set('Authorization', `Bearer ${user1.user.token}`)
      .send(data)
      .expect(400);

    data = {
      accountId: user1.accounts[0].id!,
      categoryId: null,
      amount: 67,
    };

    await request(app.server)
      .post('/operations')
      .set('Authorization', `Bearer ${user1.user.token}`)
      .send(data)
      .expect(400);
  });

  it('Operation with inexisting account or category should not be created', async () => {
    let data: CreateOperationDto = {
      accountId: 'd44a02d9-75fe-416b-ae3b-2a091afab496',
      categoryId: user1.categories[0].id!,
      amount: 12,
    };

    const response = await request(app.server)
      .post('/operations')
      .set('Authorization', `Bearer ${user1.user.token}`)
      .send(data);

    expect(response.status).toBe(404);

    data = {
      accountId: user1.accounts[0].id!,
      categoryId: '7daac09b-f0cc-4fb9-afe5-ad619eb51cf2',
      amount: 12,
    };

    await request(app.server)
      .post('/operations')
      .set('Authorization', `Bearer ${user1.user.token}`)
      .send(data)
      .expect(404);
  });

  it('User2 should not create operations with user1 entities', async () => {
    let data: CreateOperationDto = {
      accountId: user1.accounts[0].id!,
      categoryId: user2.categories[0].id!,
      amount: 42,
    };

    await request(app.server)
      .post('/operations')
      .set('Authorization', `Bearer ${user2.user.token}`)
      .send(data)
      .expect(404);

    data = {
      accountId: user2.accounts[0].id!,
      categoryId: user1.categories[0].id!,
      amount: 42,
    };

    await request(app.server)
      .post('/operations')
      .set('Authorization', `Bearer ${user2.user.token}`)
      .send(data)
      .expect(404);
  });

  it('Operation should be created', async () => {
    const data: CreateOperationDto = {
      accountId: user1.accounts[0].id!,
      categoryId: user1.categories[0].id!,
      amount: 12,
    };

    const response = await request(app.server)
      .post('/operations')
      .set('Authorization', `Bearer ${user1.user.token}`)
      .send(data)
      .expect(201);

    expect(response.body).toEqual({
      ...data,
      id: expect.stringMatching(expressions.uuid),
      accountName: user1.accounts[0].name,
      createdAt: expect.stringMatching(expressions.isoDate),
      description: null,
      type: user1.categories[0].type,
      categoryName: user1.categories[0].name,
    });

    user1.operations.push(response.body);
  });

  it('User should be able to get operation', async () => {
    const response = await request(app.server)
      .get(`/operations/${user1.operations[0].id}`)
      .set('Authorization', `Bearer ${user1.user.token}`)
      .expect(200);

    expect(response.body).toEqual(user1.operations[0]);
  });

  it('User2 should not get user1 operation', async () => {
    await request(app.server)
      .get(`/operations/${user1.operations[0].id}`)
      .set('Authorization', `Bearer ${user2.user.token}`)
      .expect(404);
  });

  it('User should create another operation', async () => {
    const data: CreateOperationDto = {
      accountId: user1.accounts[1].id!,
      categoryId: user1.categories[1].id!,
      amount: 667.44321,
      description: 'I thought it would be nice to spend mamani',
    };

    const response = await request(app.server)
      .post('/operations')
      .set('Authorization', `Bearer ${user1.user.token}`)
      .send(data)
      .expect(201);

    expect(response.body).toEqual({
      ...data,
      id: expect.stringMatching(expressions.uuid),
      amount: 667.44,
      accountName: user1.accounts[1].name,
      createdAt: expect.stringMatching(expressions.isoDate),
      type: user1.categories[1].type,
      categoryName: user1.categories[1].name,
    });

    user1.operations.push(response.body);
  });

  it('User should update his operation', async () => {
    const data: UpdateOperationDto = {
      description: 'I was so wrong, you have no idea',
      amount: 0,
      categoryId: user1.categories[0].id,
    };

    const response = await request(app.server)
      .patch(`/operations/${user1.operations[1].id}`)
      .set('Authorization', `Bearer ${user1.user.token}`)
      .send(data)
      .expect(200);

    expect(response.body).toEqual({
      ...user1.operations[1],
      ...data,
      categoryName: user1.categories[0].name,
    });

    user1.operations[1] = response.body;
  });

  it('User should get updated operation', async () => {
    const response = await request(app.server)
      .get(`/operations/${user1.operations[1].id}`)
      .set('Authorization', `Bearer ${user1.user.token}`)
      .expect(200);

    expect(response.body).toEqual(user1.operations[1]);
  });

  it('User2 should not update user1 operation', async () => {
    const data: UpdateOperationDto = {
      amount: 13,
    };

    await request(app.server)
      .patch(`/operations/${user1.operations[1].id}`)
      .set('Authorization', `Bearer ${user2.user.token}`)
      .send(data)
      .expect(403);
  });

  it('User2 should not delete user1 operation', async () => {
    await request(app.server)
      .delete(`/operations/${user1.operations[1].id}`)
      .set('Authorization', `Bearer ${user2.user.token}`)
      .expect(403);
  });

  it('User should delete his operation', async () => {
    await request(app.server)
      .delete(`/operations/${user1.operations[1].id}`)
      .set('Authorization', `Bearer ${user1.user.token}`)
      .expect(204);
  });

  it('User should not get deleted operation', async () => {
    await request(app.server)
      .get(`/operations/${user1.operations[1].id}`)
      .set('Authorization', `Bearer ${user1.user.token}`)
      .expect(404);
  });

  it('Date from payload should be applied to operation', async () => {
    const date = '1995-12-17T00:24:00.000Z';
    const data = {
      accountId: user2.accounts[0].id,
      categoryId: user2.categories[0].id,
      amount: 123456,
      createdAt: date,
    };

    const response = await request(app.server)
      .post('/operations')
      .set('Authorization', `Bearer ${user2.user.token}`)
      .send(data);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      ...data,
      id: expect.stringMatching(expressions.uuid),
      accountName: user2.accounts[0].name,
      createdAt: date,
      description: null,
      type: user2.categories[0].type,
      categoryName: user2.categories[0].name,
    });

    user2.operations.push(response.body);
  });

  it('Wrong date format should get 400', async () => {
    const data = {
      accountId: user2.accounts[0].id,
      categoryId: user2.categories[0].id,
      amount: 123456,
      createdAt: 'Just yesterday',
    };

    const response = await request(app.server)
      .post('/operations')
      .set('Authorization', `Bearer ${user2.user.token}`)
      .send(data);

    expect(response.status).toBe(400);
  });
});
