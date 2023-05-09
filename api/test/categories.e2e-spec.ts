import { CreateCategoryDto } from '../src/features/operation-categories/dto/create-category.dto';
import { OperationType } from '../src/features/operations/entities/operation-type';
import { expressions } from '../src/shared/models/regex';
import { TestUser } from './utils/generators/test.user';
import { TestApp } from './utils/test.app';
import * as request from 'supertest';

describe('CategoriesController (e2e)', () => {
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
      request(app.server).get('/categories/'),
      request(app.server).get('/categories/4553'),
      request(app.server).post('/categories/').send('data'),
      request(app.server).patch('/categories/3656').send('data'),
      request(app.server).delete('/categories/3656'),
    ];
    const responses = await Promise.all(promises);
    for (const res of responses) {
      expect(res.status).toBe(401);
    }
  });

  let user1: TestUser;
  it('User should not have categories', async () => {
    user1 = TestUser.users[0];
    const response = await request(app.server)
      .get('/categories')
      .set('Authorization', `Bearer ${user1.token}`)
      .expect(200);

    expect(response.body).toEqual([]);
  });

  let categoryId: string;
  const categoryData: CreateCategoryDto = {
    type: OperationType.Outcome,
    name: 'Household',
    description: 'Goods for housekeeping & maintenance',
    color: '#0099ff',
  };

  let category2Id: string;
  const category2Data: CreateCategoryDto = {
    type: OperationType.Income,
    name: 'Dividends',
    description: 'Income from shares',
    color: '#00aa00',
  };

  it('User should be able to create categories', async () => {
    let response = await request(app.server)
      .post('/categories')
      .send(categoryData)
      .set('Authorization', `Bearer ${user1.token}`)
      .expect(201);

    expect(response.body).toEqual({
      ...categoryData,
      userId: user1.id,
      id: expect.stringMatching(expressions.uuid),
      parentId: null,
    });

    categoryId = response.body.id;

    response = await request(app.server)
      .post('/categories')
      .send(category2Data)
      .set('Authorization', `Bearer ${user1.token}`)
      .expect(201);

    expect(response.body).toEqual({
      ...category2Data,
      userId: user1.id,
      id: expect.stringMatching(expressions.uuid),
      parentId: null,
    });

    category2Id = response.body.id;
  });
});
