import { Logger } from '@nestjs/common';
import { ViewAccountDto } from '../dto/view-account.dto';

export abstract class AccountsQueryRepository {
  protected readonly logger = new Logger('AccountsQueryRepository');

  abstract get(id: string): Promise<ViewAccountDto | undefined>;
  abstract getByUser(id: string): Promise<ViewAccountDto[]>;
}
