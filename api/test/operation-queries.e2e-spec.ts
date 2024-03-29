import { ViewOperationDto } from '../src/features/operations/dto/view-operation.dto';
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
    const response = await request(app.server)
      .get('/operations')
      .set('Authorization', `Bearer ${user2.user.token}`)
      .expect(200);

    expect(response.body).toEqual({
      page: 1,
      pageSize: 20,
      pagesTotal: 0,
      elementsTotal: 0,
      elements: [],
    });
  });

  it('User1 should get first page', async () => {
    user1.operations.reverse();

    const response = await request(app.server)
      .get('/operations')
      .set('Authorization', `Bearer ${user1.user.token}`)
      .expect(200);

    expect(response.body).toEqual({
      pageSize: 20,
      page: 1,
      pagesTotal: 3,
      elementsTotal: 48,
      elements: user1.operations.slice(0, 20),
    });
  });

  it('User1 should get last page', async () => {
    const response = await request(app.server)
      .get('/operations')
      .query({ page: 3 })
      .set('Authorization', `Bearer ${user1.user.token}`)
      .expect(200);

    expect(response.body).toEqual({
      pageSize: 20,
      page: 3,
      pagesTotal: 3,
      elementsTotal: 48,
      elements: user1.operations.slice(40),
    });
  });

  it('User1 should get first page ASC', async () => {
    user1.operations.reverse();

    const response = await request(app.server)
      .get('/operations')
      .set('Authorization', `Bearer ${user1.user.token}`)
      .query({ sortDirection: 'ASC' })
      .expect(200);

    expect(response.body).toEqual({
      pageSize: 20,
      page: 1,
      pagesTotal: 3,
      elementsTotal: 48,
      elements: user1.operations.slice(0, 20),
    });
  });

  it('User1 should get first page ASC with time limits', async () => {
    const startDate = user1.operations[3].createdAt;
    const endDate = user1.operations[7].createdAt;

    const response = await request(app.server)
      .get('/operations')
      .set('Authorization', `Bearer ${user1.user.token}`)
      .query({ sortDirection: 'ASC', startDate, endDate })
      .expect(200);

    expect(response.body.elements.length).toBe(5);
    expect(response.body).toEqual({
      pageSize: 20,
      page: 1,
      pagesTotal: 1,
      elementsTotal: 5,
      elements: user1.operations.slice(3, 8),
    });
  });

  it('User1 should get only Income operations', async () => {
    const response = await request(app.server)
      .get('/operations')
      .set('Authorization', `Bearer ${user1.user.token}`)
      .query({ sortDirection: 'ASC', type: 'Income', page: 2 })
      .expect(200);

    expect(response.body).toEqual({
      pageSize: 20,
      page: 2,
      pagesTotal: 2,
      elementsTotal: 24,
      elements: user1.operations.slice(20, 24),
    });
  });

  it('User1 should get category2 operations', async () => {
    const cat = user1.categories[1].id;

    const response = await request(app.server)
      .get('/operations')
      .set('Authorization', `Bearer ${user1.user.token}`)
      .query({ categoryId: cat, sortDirection: 'ASC' })
      .expect(200);

    expect(response.body).toEqual({
      pageSize: 20,
      page: 1,
      pagesTotal: 2,
      elementsTotal: 24,
      elements: user1.operations
        .filter((o) => o.categoryId === cat)
        .slice(0, 20),
    });
  });

  it('User1 should not get operations for account2', async () => {
    const response = await request(app.server)
      .get('/operations')
      .set('Authorization', `Bearer ${user1.user.token}`)
      .query({ accountId: user1.accounts[1].id })
      .expect(200);

    expect(response.body).toEqual({
      pageSize: 20,
      page: 1,
      pagesTotal: 0,
      elementsTotal: 0,
      elements: [],
    });
  });

  it('User1 should get operations sorted by amount', async () => {
    user1.operations.sort(
      (a: ViewOperationDto, b: ViewOperationDto): number => {
        return b.amount - a.amount;
      },
    );

    const response = await request(app.server)
      .get('/operations')
      .set('Authorization', `Bearer ${user1.user.token}`)
      .query({ sortBy: 'amount' })
      .expect(200);

    expect(response.body).toEqual({
      pageSize: 20,
      page: 1,
      pagesTotal: 3,
      elementsTotal: 48,
      elements: user1.operations.slice(0, 20),
    });
  });
});
