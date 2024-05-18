import { BaseDTO } from './base.dto';

export class BaseEntity<T extends BaseDTO> {
  protected readonly _initialState: T;

  private _changes: Exclude<Partial<T>, BaseDTO> | null;

  constructor(state: T) {
    this._initialState = { ...state };
    this._changes = null;
  }

  public get id(): string {
    return this._initialState.id;
  }

  /** Get changes to update persistence and commit transaction */
  public get changes(): Partial<T> | null {
    return this._changes ? { ...this._changes, updatedAt: new Date() } : null;
  }

  /** Prepare data to be updated and sent to persistence */
  protected makeChanges(data: Exclude<Partial<T>, BaseDTO>): void {
    if (this._changes) {
      data = { ...this._changes, ...data };
    }

    this._changes = { ...data };
  }
}
