import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateOperationCommand } from '../commands/create-operation.command';
import { GetAccountQuery } from '../../../accounts/usecases/queries/get-account.query';
import { Account } from '../../../accounts/entities/account.entity';
import { Category } from '../../../operation-categories/entities/category.entity';
import { GetCategoryQuery } from '../../../operation-categories/usecases/queries/get-category.query';
import { Operation } from '../../entities/operation.entity';
import { OperationsService } from '../../operations.service';

@CommandHandler(CreateOperationCommand)
export class CreateOperationHandler
  implements ICommandHandler<CreateOperationCommand>
{
  constructor(
    private readonly service: OperationsService,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: CreateOperationCommand): Promise<string> {
    const { accountId, categoryId } = command.data;
    const userId = command.userId;

    const account: Account = await this.queryBus.execute(
      new GetAccountQuery(accountId, userId),
    );
    if (!account) throw new NotFoundException('Account not found');

    const category: Category = await this.queryBus.execute(
      new GetCategoryQuery(categoryId, userId),
    );
    if (!category) throw new NotFoundException('Category not found');

    const operation = Operation.create(command.data, account, category);
    if (operation instanceof Operation) return this.service.save(operation);

    throw new BadRequestException(this.service.errorText(operation));
  }
}
