import { UserDTO } from '../dto/user.dto';

export class CreateUserCommand {
  constructor(public readonly data: UserDTO) {}
}

export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly data: Partial<UserDTO>,
  ) {}
}

export class DeleteUserCommand {
  constructor(public readonly id: string) {}
}
