import { CreateCategoryDto } from '../src/features/operation-categories/dto/create-category.dto';
import { OperationType } from '../src/features/operations/entities/operation-type';
import { expressions } from '../src/shared/models/regex';
import { TestUser } from './utils/generators/test.user';
import { TestApp } from './utils/test.app';
import * as request from 'supertest';

describe('CategoriesController (e2e)', () => {
  let app: TestApp;
  let user1: TestUser;
  let user2: TestUser;

  beforeAll(async () => {
    app = new TestApp();
    await app.start();
    await app.clearAllData();

    TestUser.clear();
    TestUser.generate(app.server, 2);
    await TestUser.RegisterAndLoginAll();

    user1 = TestUser.users[0];
    user2 = TestUser.users[1];
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

  it('User should not have categories', async () => {
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

  it('User1 should get his category', async () => {
    const response = await request(app.server)
      .get(`/categories/${categoryId}`)
      .set('Authorization', `Bearer ${user1.token}`)
      .expect(200);

    expect(response.body).toEqual({
      ...categoryData,
      userId: user1.id,
      id: categoryId,
      parentId: null,
    });
  });

  let childId: string;
  const childData: CreateCategoryDto = {
    type: OperationType.Income,
    name: 'US corporations',
    description: 'Income from shares',
    color: '#00aa66',
  };
  it('User should be able to create child category', async () => {
    childData.parentId = category2Id;

    const response = await request(app.server)
      .post('/categories')
      .send(childData)
      .set('Authorization', `Bearer ${user1.token}`)
      .expect(201);

    expect(response.body).toEqual({
      ...childData,
      userId: user1.id,
      id: expect.stringMatching(expressions.uuid),
      parentId: category2Id,
    });

    childId = response.body.id;
  });

  it('User should get all created categories', async () => {
    const response = await request(app.server)
      .get(`/categories`)
      .set('Authorization', `Bearer ${user1.token}`)
      .expect(200);

    expect(response.body).toEqual([
      {
        ...category2Data,
        id: category2Id,
        userId: user1.id,
        parentId: null,
        children: [
          {
            ...childData,
            id: childId,
            userId: user1.id,
          },
        ],
      },
      {
        ...categoryData,
        id: categoryId,
        userId: user1.id,
        parentId: null,
      },
    ]);
  });

  it('User should be able to update category', async () => {
    categoryData.name = 'Mortgage';
    categoryData.description = 'Monthly payments';
    categoryData.color = '#abcdef';

    const response = await request(app.server)
      .patch(`/categories/${categoryId}`)
      .send({
        name: categoryData.name,
        description: categoryData.description,
        color: categoryData.color,
      })
      .set('Authorization', `Bearer ${user1.token}`)
      .expect(200);

    expect(response.body).toEqual({
      ...categoryData,
      userId: user1.id,
      id: categoryId,
      parentId: null,
    });
  });

  it('User should be able to delete category', async () => {
    const response = await request(app.server)
      .delete(`/categories/${categoryId}`)
      .set('Authorization', `Bearer ${user1.token}`)
      .expect(204);
  });

  it('User should not be able to delete category with children', async () => {
    const response = await request(app.server)
      .delete(`/categories/${category2Id}`)
      .set('Authorization', `Bearer ${user1.token}`)
      .expect(403);
  });

  it('User2 should not get categories', async () => {
    let response = await request(app.server)
      .get(`/categories`)
      .set('Authorization', `Bearer ${user2.token}`)
      .expect(200);

    expect(response.body).toEqual([]);

    response = await request(app.server)
      .get(`/categories/${category2Id}`)
      .set('Authorization', `Bearer ${user2.token}`)
      .expect(403);
  });

  it('User2 should not update user1 category', async () => {
    await request(app.server)
      .patch(`/categories/${childId}`)
      .send({ name: 'Google' })
      .set('Authorization', `Bearer ${user2.token}`)
      .expect(403);
  });

  it('User2 should not delete user1 category', async () => {
    await request(app.server)
      .delete(`/categories/${childId}`)
      .set('Authorization', `Bearer ${user2.token}`)
      .expect(403);
  });
});
