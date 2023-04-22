import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    length: 200,
    nullable: false,
    collation: 'C',
  })
  email: string;

  @Column({
    type: 'character varying',
    length: 100,
    nullable: false,
    collation: 'C',
  })
  firstName: string;

  @Column({
    type: 'character varying',
    length: 100,
    nullable: false,
    collation: 'C',
  })
  lastName: string;

  @Column({
    type: 'character varying',
    length: 200,
    nullable: false,
    collation: 'C',
  })
  hash: string;

  @Column({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => Account, (a) => a.user)
  accounts?: Account[];
}
