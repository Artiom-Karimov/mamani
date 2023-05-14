import { Operation } from './operation.entity';

describe('Operation unit tests', () => {
  it('Simple number conversion', () => {
    const op = new Operation();
    op.number = 1;
    expect(op.amount).toBe('100');
    expect(op.number).toBe(1);
  });

  it('Float conversion', () => {
    const op = new Operation();
    op.number = 5 / 3;
    expect(op.amount).toBe('167');
    expect(op.number).toBe(1.67);
  });
});
