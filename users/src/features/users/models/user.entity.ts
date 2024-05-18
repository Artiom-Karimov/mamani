import {
  BaseDTO,
  BaseEntity,
  DomainError,
  ErrorCase,
  UserRole,
} from '@mamani/shared';
import { UserDTO } from '../dto/user.dto';
import { CreateUserDTO } from '../dto/create-user.dto';
import {
  CreateUserCommand,
  UpdateUserCommand,
} from '../commands/user.commands';
import { randomUUID } from 'crypto';
import { Hasher } from 'src/utils/hasher';
import { RegisterUserDTO } from '../dto/register-user.dto';
import { SelfUpdateUserDTO } from '../dto/self-update-user.dto';

export class User extends BaseEntity<UserDTO> {
  public get role(): UserRole {
    return this.changes?.role ?? this._initialState.role;
  }

  public async checkPassword(password: string): Promise<void> {
    const match = await Hasher.compare(
      this.changes?.hash ?? this._initialState.hash,
      password,
    );

    if (!match) {
      throw new DomainError(ErrorCase.InvalidInput, 'Wrong password');
    }
  }

  public static async register(
    data: RegisterUserDTO,
  ): Promise<CreateUserCommand> {
    const user = new User({
      id: randomUUID(),
      role: UserRole.User,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      hash: await Hasher.hash(data.password),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return new CreateUserCommand({ ...user._initialState });
  }

  public static async create(
    data: CreateUserDTO,
    admin: User,
  ): Promise<CreateUserCommand> {
    User.ensureCreationAllowed(admin);

    const user = new User({
      id: randomUUID(),
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      hash: await Hasher.hash(data.password),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return new CreateUserCommand({ ...user._initialState });
  }

  public async selfUpdate(
    data: SelfUpdateUserDTO,
  ): Promise<UpdateUserCommand | null> {
    const { oldPassword, newPassword, email, firstName, lastName } = data;

    await this.checkPassword(oldPassword);

    if (newPassword) {
      await this.checkPasswordForUpdate(newPassword);
      this.makeChanges({ hash: await Hasher.hash(newPassword) });
    }

    if (email) this.makeChanges({ email });
    if (firstName) this.makeChanges({ firstName });
    if (lastName) this.makeChanges({ lastName });

    const changes = this.changes;

    return changes ? new UpdateUserCommand(this.id, changes) : null;
  }

  private static ensureCreationAllowed(admin: User): void {
    if (admin.role !== UserRole.Admin) {
      throw new DomainError(ErrorCase.AccessDenied);
    }
  }

  private async checkPasswordForUpdate(newPassword: string): Promise<void> {
    const match = await Hasher.compare(
      this.changes?.hash ?? this._initialState.hash,
      newPassword,
    );

    if (match) {
      throw new DomainError(
        ErrorCase.InvalidInput,
        'New passwoord cannot be the same as old one',
      );
    }
  }
}
