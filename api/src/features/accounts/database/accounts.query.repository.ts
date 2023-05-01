import { Logger } from '@nestjs/common';
import { ViewAccountDto } from '../dto/view-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../entities/account.entity';
import { Repository } from 'typeorm';

export class AccountsQueryRepository {
  private readonly logger = new Logger('AccountsQueryRepository');

  constructor(
    @InjectRepository(Account) private readonly repo: Repository<Account>,
  ) {}

  async get(id: string): Promise<ViewAccountDto | undefined> {
    try {
      const result = await this.repo.findOneBy({ id });
      return result ? new ViewAccountDto(result) : undefined;
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }
  async getByUser(userId: string): Promise<ViewAccountDto[]> {
    try {
      const result = await this.repo.find({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
      return result.map((a) => new ViewAccountDto(a));
    } catch (error) {
      this.logger.error(error);
      return [];
    }
  }
}
