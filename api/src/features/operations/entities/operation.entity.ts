import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { OperationType } from './operation-type';
import { Category } from '../../operation-categories/entities/category.entity';
import { DomainEntity } from '../../../shared/models/domain.entity';

@Entity()
export class Operation extends DomainEntity {
  @Column({ type: 'uuid', nullable: false })
  accountId: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({
    type: 'character varying',
    length: 300,
    nullable: true,
    collation: 'C',
  })
  description?: string;

  @Column({
    type: 'character varying',
    length: 100,
    nullable: false,
    collation: 'C',
  })
  amount: string;

  @Column({ type: 'enum', enum: OperationType, nullable: false })
  type: OperationType;

  @Column({ type: 'uuid', nullable: true })
  categoryId?: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category?: Category;
}
