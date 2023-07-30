import {
  Controller,
  Get,
  NotImplementedException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { ReportsQueryRepository } from './database/reports.query-repository';
import { OverallReportDto } from './dto/overall-report.dto';
import { AccountReportDto } from './dto/account-report.dto';
import { ReportItemDto } from './dto/report-item.dto';
import { ReportsQueryDto } from './dto/reports-query.dto';

@ApiTags('reports')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('reports')
@UseGuards(AuthGuard)
export class ReportsController {
  constructor(private readonly repo: ReportsQueryRepository) {}

  @Get()
  async getOverallReport(
    @Query() query: ReportsQueryDto,
  ): Promise<OverallReportDto> {
    throw new NotImplementedException();
  }

  @Get('accounts/:accountId')
  async getAccountReport(
    @Query() query: ReportsQueryDto,
    @Param('accountId') accountId: string,
  ): Promise<AccountReportDto> {
    throw new NotImplementedException();
  }

  @Get('categories/:categoryId')
  async getCategoryReport(
    @Query() query: ReportsQueryDto,
    @Param('categoryId') categoryId: string,
  ): Promise<ReportItemDto> {
    throw new NotImplementedException();
  }
}
