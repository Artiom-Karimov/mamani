import { CreateOperationDto } from '../src/features/operations/dto/create-operation.dto';
import { UpdateOperationDto } from '../src/features/operations/dto/update-operation.dto';
import { OperationType } from '../src/features/operations/entities/operation-type';
import { expressions } from '../src/shared/models/regex';
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
    await user1.createCategories(1, OperationType.Outcome);
    await prepareOperations(user1, 24, OperationType.Income);
    await prepareOperations(user1, 24, OperationType.Outcome);

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
});
