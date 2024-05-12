import { CreateAccountDto } from '../../dto/create-account.dto';

export class CreateAccountCommand {
  constructor(
    public userId: string,
    public data: CreateAccountDto,
  ) {}
}
