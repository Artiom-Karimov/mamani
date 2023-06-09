import { Column, Entity, OneToMany } from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { Hasher } from '../../../shared/tools/hasher';
import { DomainEntity } from '../../../shared/models/domain.entity';

@Entity()
export class User extends DomainEntity {
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

  @OneToMany(() => Account, (a) => a.user)
  accounts?: Account[];

  /** Convert inputDto to new user instance */
  static async create(data: CreateUserDto): Promise<User> {
    const user = new User();

    user.email = data.email;
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.hash = await Hasher.hash(data.password);
    user.createdAt = new Date();

    return user;
  }

  async checkPassword(password: string): Promise<boolean> {
    return Hasher.compare(this.hash, password);
  }
}
