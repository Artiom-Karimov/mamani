import { AccountReportDto } from './account-report.dto';

export class OverallReportDto {
  startDate: Date;
  endDate: Date;
  accounts: AccountReportDto[];
  total: number;
}
