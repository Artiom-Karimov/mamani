import { ViewAccountDto } from '../dto/view-account.dto';
import { AccountsQueryRepository } from './accounts.query.repository';

export class TypeormAccountsQueryRepository extends AccountsQueryRepository {
  get(id: string): Promise<ViewAccountDto | undefined> {
    throw new Error('Method not implemented.');
  }
  getByUser(id: string): Promise<ViewAccountDto[]> {
    throw new Error('Method not implemented.');
  }
}
