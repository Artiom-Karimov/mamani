import { UpdateAccountDto } from '../../dto/update-account.dto';

export class UpdateAccountCommand {
  constructor(
    public id: string,
    public data: UpdateAccountDto,
    public userId: string,
  ) {}
}
