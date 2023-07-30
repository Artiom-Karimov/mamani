import { ReportItemDto } from './report-item.dto';

export class AccountReportDto {
  accountId: string;
  accountName: string;
  items: ReportItemDto[];
  total: number;
}
