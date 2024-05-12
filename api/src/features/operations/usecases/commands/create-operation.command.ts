import { CreateOperationDto } from '../../dto/create-operation.dto';

export class CreateOperationCommand {
  constructor(
    public data: CreateOperationDto,
    public userId: string,
  ) {}
}
