import { LoginDto } from '../../dto/login.dto';

export class LoginCommand {
  constructor(public data: LoginDto) {}
}
