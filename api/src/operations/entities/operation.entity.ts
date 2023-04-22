import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { OperationType } from './operation-type';
import { OperationCategory } from './operation-category.entity';

@Entity()
export class Operation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  accountId: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

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

  @ManyToOne(() => OperationCategory)
  @JoinColumn({ name: 'categoryId' })
  category?: OperationCategory;
}
