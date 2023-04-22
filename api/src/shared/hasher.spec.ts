import { Hasher } from './hasher';

describe('Password hasher unit tests', () => {
  it('Initial password should pass', async () => {
    const pass = 'WholePassword';
    const hash = await Hasher.hash(pass);
    const result = await Hasher.compare(hash, pass);
    expect(result).toBe(true);
  });

  it('Wrong password should fail', async () => {
    const hash = await Hasher.hash('therightone');
    const result = await Hasher.compare(hash, 'thewrongone');
    expect(result).toBe(false);
  });

  it('Empty string should fail', async () => {
    const hash = await Hasher.hash('therightone');
    const result = await Hasher.compare(hash, '');
    expect(result).toBe(false);
  });

  it('Null should fail', async () => {
    const hash = await Hasher.hash('therightone');
    const result = await Hasher.compare(hash, null);
    expect(result).toBe(false);
  });
});
