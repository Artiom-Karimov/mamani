import { JsonWebTokenError } from 'jsonwebtoken';
import { AsyncJwt } from './async-jwt';
import { TokenPayload } from '../../features/auth/dto/token-payload';

describe('Async JWT adapter tests', () => {
  it('sign should return string', async () => {
    const payload = new TokenPayload('hello');
    const token = await AsyncJwt.sign(payload, 'secret');
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
    expect(token.includes('.')).toBe(true);
  });

  it('sign should not block event loop', async () => {
    let counter = 0;
    const payload = new TokenPayload('35462435');

    const increment = () => counter++;

    const promise = AsyncJwt.sign(payload, 'symbols').then(() => increment());
    expect(counter).toBe(0);
    await promise;

    expect(counter).toBe(1);
  });

  it('verify should return initial payload', async () => {
    const payload = new TokenPayload('moo');
    const key = 'strong_key';
    const token = await AsyncJwt.sign(payload, key);
    const decoded = await AsyncJwt.verify(token, key);

    expect(decoded).toEqual(payload);
  });

  it('verify should not decode with wrong key', async () => {
    const payload = new TokenPayload('ohno');
    const key = 'strong_key';
    const token = await AsyncJwt.sign(payload, key);

    const decoded = await AsyncJwt.verify(token, 'whoops')
      .then(() => fail('Promise should be rejected'))
      .catch((error) => expect(error).toBeInstanceOf(JsonWebTokenError));
  });
});
