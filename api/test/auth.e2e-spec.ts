import { CreateUserDto } from '../src/features/users/dto/create-user.dto';
import { expressions } from '../src/shared/models/regex';
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

  it('Login with wrong data should fail', async () => {
    await request(app.server)
      .post('/auth/login')
      .send({ password: 'password' })
      .expect(400);

    await request(app.server)
      .post('/auth/login')
      .send({ email: 'hoo@l.ey' })
      .expect(400);
  });

  it('Login should fail', async () => {
    await request(app.server)
      .post('/auth/login')
      .send({ email: 'noname@example.com', password: 'examplePass' })
      .expect(401);
  });

  it('Register should fail on wrong data', async () => {
    const data: CreateUserDto = {
      email: 'oneorivo',
      firstName: 'Oleg',
      lastName: 'Oleg',
      password: 'legal-password',
    };

    await request(app.server).post('/auth/register').send(data).expect(400);
    data.email = 'legal@email.com';
    data.firstName = '';
    await request(app.server).post('/auth/register').send(data).expect(400);
    data.firstName = 'Olezha';
    data.lastName =
      'pojrovjrnvpojrormvpormvroivmimrimvmvimkrkmvrkmrokmvrmvirmvirmvimrimvrmvmrkmvrrvrmvrmvirmvirv;oimoim[im[oimi';
    await request(app.server).post('/auth/register').send(data).expect(400);
    data.lastName = 'Legal';
    data.password = '123';
    await request(app.server).post('/auth/register').send(data).expect(400);
  });

  let userData: CreateUserDto;
  it('Successful registration', async () => {
    userData = {
      email: 'gribochek@mgail.com',
      firstName: 'Whois',
      lastName: 'Theuser',
      password: 'likePassword',
    };
    const expected = {
      id: expect.stringMatching(expressions.uuid),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      createdAt: expect.stringMatching(expressions.isoDate),
    };

    const res = await request(app.server)
      .post('/auth/register')
      .send(userData)
      .expect(201);

    expect(res.body).toEqual(expected);
  });

  it('User with the same email should not be registered', async () => {
    const data = { ...userData, firstName: 'Ikea' };
    await request(app.server).post('/auth/register').send(data).expect(400);
  });

  it('User with the same name should be registered', async () => {
    const data = { ...userData, email: 'another@email.com' };
    await request(app.server).post('/auth/register').send(data).expect(201);
  });

  let token: string;
  it('Registered user should be able to login', async () => {
    const expected = { token: expect.anything() };

    const res = await request(app.server)
      .post('/auth/login')
      .send({ email: userData.email, password: userData.password })
      .expect(201);

    expect(res.body).toEqual(expected);
    token = res.body.token;
  });

  it('Logged in user should receive self info', async () => {
    const expected = {
      id: expect.stringMatching(expressions.uuid),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      createdAt: expect.stringMatching(expressions.isoDate),
    };

    const res = await request(app.server)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toEqual(expected);
  });

  it('auth/me should fail with wrong token', async () => {
    const res = await request(app.server)
      .get('/auth/me')
      .set('Authorization', `Bearer rfoijfeifjfeoijfe`)
      .expect(401);
  });

  it('Registered user should fail to login with wrong password', async () => {
    await request(app.server)
      .post('/auth/login')
      .send({ email: userData.email, password: 'wrong-password' })
      .expect(401);
  });
});
