import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { DomainEntity } from '../../../shared/models/domain.entity';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';

@Entity()
export class Account extends DomainEntity {
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'character varying',
    length: 100,
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

  @Column({ type: 'boolean', nullable: false, default: false })
  default: boolean;

  @Column({
    type: 'character varying',
    length: 20,
    nullable: true,
    collation: 'C',
  })
  color?: string;

  constructor(user?: User, data?: CreateAccountDto) {
    super();
    if (!user || !data) return;
    this.user = user;
    this.userId = user.id;

    this.name = data.name;
    this.description = data.description;
    this.default = data.default === true;
    this.color = data.color;
  }

  update(data: UpdateAccountDto): void {
    if (data.name) this.name = data.name;
    if (data.description) this.description = data.description;
    if (data.default != null) this.default = data.default;
    if (data.color) this.color = data.color;
  }
}
