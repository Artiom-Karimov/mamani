import { Controller, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { ReportsQueryRepository } from './database/reports.query-repository';

@ApiTags('reports')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('reports')
@UseGuards(AuthGuard)
export class ReportsController {
  constructor(private readonly repo: ReportsQueryRepository) {}
}
