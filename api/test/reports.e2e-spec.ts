import { OperationType } from '../src/features/operations/entities/operation-type';
import { TestOperationUser } from './utils/generators/test.operation-user';
import { TestApp } from './utils/test.app';
import * as request from 'supertest';

const prepareOperations = async (
  user: TestOperationUser,
  amount: number,
  type: OperationType,
) => {
  const account = user.accounts[0];
  const category = user.categories.find((c) => c.type === type);

  for (let i = 0; i < amount; i++) {
    const rand = Math.random() * 1000;
    await user.createOperation(account, category!, rand);
  }
};

describe('Queries for operations (e2e)', () => {
  let app: TestApp;
  let user1: TestOperationUser;
  let user2: TestOperationUser;

  beforeAll(async () => {
    app = new TestApp();
    await app.start();
    await app.clearAllData();

    user1 = await TestOperationUser.create(app.server);
    await user1.createAccounts(2);
    await user1.createCategories(1, OperationType.Income);
    await user1.createCategories(1, OperationType.Expence);
    await prepareOperations(user1, 24, OperationType.Income);
    await prepareOperations(user1, 24, OperationType.Expence);

    user2 = await TestOperationUser.create(app.server);
  }, 20_000);

  afterAll(async () => {
    await app.stop();
  });

  it('User2 should not have operations', async () => {
    const { body, status } = await request(app.server)
      .get(`/reports/categories/${user2.categories[0]}`)
      .set('Authorization', `Bearer ${user2.user.token}`);

    expect(status).toBe(404);
  });

  it('User1 should get total by category', async () => {
    const { body, status } = await request(app.server)
      .get(`/reports/categories/${user1.categories[0].id}`)
      .set('Authorization', `Bearer ${user1.user.token}`);

    expect(status).toBe(200);

    const expectedSum = user1.operations
      .filter((o) => o.categoryId === user1.categories[0].id)
      .reduce((a, b) => a + b.amount, 0);

    expect(body).toEqual({
      categoryId: user1.categories[0].id,
      categoryName: user1.categories[0].name,
      total: expect.closeTo(expectedSum),
    });
  });
});
