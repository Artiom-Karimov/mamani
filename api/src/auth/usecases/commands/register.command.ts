import { CreateUserDto } from '../../../users/dto/create-user.dto';

export class RegisterCommand {
  constructor(public data: CreateUserDto) {}
}
