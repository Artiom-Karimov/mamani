import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { OperationType } from './operation-type';
import { Category } from '../../operation-categories/entities/category.entity';
import { DomainEntity } from '../../../shared/models/domain.entity';
import { CreateOperationDto } from '../dto/create-operation.dto';
import { OperationError } from './operation-error';
import { UpdateOperationDto } from '../dto/update-operation.dto';

@Entity()
export class Operation extends DomainEntity {
  @Column({ type: 'uuid', nullable: false })
  accountId: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accountId' })
  account?: Account;

  @Column({
    type: 'character varying',
    length: 300,
    nullable: true,
    collation: 'C',
  })
  description?: string;

  /** Money stored as a string representation of BigInt.
   * Actual money amount is value / 100 (1 is a cent)
   */
  @Column({
    type: 'bigint',
    nullable: false,
  })
  amount: string;

  @Column({ type: 'enum', enum: OperationType, nullable: false })
  type: OperationType;

  @Column({ type: 'uuid', nullable: false })
  categoryId: string;

  @ManyToOne(() => Category, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  category?: Category;

  /** Amount converted to float */
  get number(): number {
    return +this.amount / 100;
  }
  /** Amount converted to float */
  set number(value: number) {
    this.amount = (value * 100).toFixed(0);
  }

  /** Actual money amount is (value / 100) (1 is a cent) */
  get bigint(): bigint {
    return BigInt(this.amount);
  }
  /** Actual money amount is (value / 100) (1 is a cent) */
  set bigint(value: bigint) {
    this.amount = value.toString();
  }

  static create(
    data: CreateOperationDto,
    account: Account,
    category: Category,
  ): Operation | OperationError {
    const err = Operation.checkBeforeCreating(data, account, category);
    if (err !== OperationError.NoError) return err;

    const result = new Operation();

    result.account = account;
    result.accountId = account.id;
    result.number = data.amount;
    result.category = category;
    result.categoryId = category.id;
    result.createdAt = data.createdAt || new Date();
    result.description = data.description;
    result.type = category.type;

    return result;
  }

  /** To update category call 'updateCategory' */
  public update(data: UpdateOperationDto): OperationError {
    const err = this.checkBeforeUpdate(data);
    if (err !== OperationError.NoError) return err;

    if (data.amount != null) this.number = data.amount;
    if (data.description != null) this.description = data.description;

    return OperationError.NoError;
  }

  public updateCategory(category: Category): OperationError {
    if (category.userId && category.userId !== this.account?.userId)
      return OperationError.ForeignCategory;

    this.category = category;
    this.categoryId = category.id;

    return OperationError.NoError;
  }

  private static checkBeforeCreating(
    data: CreateOperationDto,
    account: Account,
    category: Category,
  ): OperationError {
    if (!data || !account || !category) return OperationError.NotEnoughData;
    if (category.userId && account.userId !== category.userId)
      return OperationError.ForeignCategory;

    if (!Operation.checkNumber(data.amount))
      return OperationError.IllegalAmount;

    return OperationError.NoError;
  }

  private static checkNumber(value: number): boolean {
    return !isNaN(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER;
  }

  private checkBeforeUpdate(data: UpdateOperationDto): OperationError {
    if (data.amount != null && !Operation.checkNumber(data.amount))
      return OperationError.IllegalAmount;

    return OperationError.NoError;
  }
}
