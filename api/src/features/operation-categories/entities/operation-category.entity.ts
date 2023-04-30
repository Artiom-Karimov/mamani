import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OperationType } from '../../operations/entities/operation-type';
import { DomainEntity } from '../../../shared/models/domain.entity';

@Entity()
export class OperationCategory extends DomainEntity {
  @Column({ type: 'enum', enum: OperationType, nullable: false })
  type: OperationType;

  @Column({
    type: 'character varying',
    length: 50,
    nullable: false,
    collation: 'C',
  })
  name: string;

  @Column({
    type: 'character varying',
    length: 300,
    nullable: true,
    collation: 'C',
  })
  description?: string;

  @Column({
    type: 'character varying',
    length: 20,
    nullable: true,
    collation: 'C',
  })
  color?: string;

  @Column({ type: 'uuid', nullable: true })
  parentId?: string;

  @ManyToOne(() => OperationCategory, (p) => p.children)
  @JoinColumn({ name: 'parentId' })
  parent?: OperationCategory;

  @OneToMany(() => OperationCategory, (c) => c.parent)
  children?: OperationCategory[];
}
