import { ApiProperty } from '@nestjs/swagger';
import { PageDto } from '../../../shared/models/page.dto';
import { ViewOperationDto } from './view-operation.dto';

export class OperationPageDto extends PageDto<ViewOperationDto> {
  @ApiProperty({ type: [ViewOperationDto] })
  elements: ViewOperationDto[];
}
