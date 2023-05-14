import { UpdateOperationDto } from '../../dto/update-operation.dto';

export class UpdateOperationCommand {
  constructor(
    public id: string,
    public data: UpdateOperationDto,
    public userId: string,
  ) {}
}
