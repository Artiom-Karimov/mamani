import { ErrorCase } from './error-case';

export class DomainError extends Error {
  constructor(
    public readonly errorCase: ErrorCase,
    public readonly logMessage?: string,
    public readonly nestedError?: unknown,
  ) {
    super(logMessage || DomainError.name);
    this.name = DomainError.name;
  }
}
