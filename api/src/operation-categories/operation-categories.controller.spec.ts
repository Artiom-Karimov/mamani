import { Test, TestingModule } from '@nestjs/testing';
import { OperationCategoriesController } from './operation-categories.controller';
import { OperationCategoriesService } from './operation-categories.service';

describe('OperationCategoriesController', () => {
  let controller: OperationCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperationCategoriesController],
      providers: [OperationCategoriesService],
    }).compile();

    controller = module.get<OperationCategoriesController>(
      OperationCategoriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
