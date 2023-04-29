import { Logger } from '@nestjs/common';
import { ViewUserDto } from '../dto/view-user.dto';

export abstract class UsersQueryRepository {
  protected readonly logger = new Logger('UsersQueryRepository');

  abstract get(id: string): Promise<ViewUserDto | undefined>;
}
