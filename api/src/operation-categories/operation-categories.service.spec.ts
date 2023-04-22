import { Test, TestingModule } from '@nestjs/testing';
import { OperationCategoriesService } from './operation-categories.service';

describe('OperationCategoriesService', () => {
  let service: OperationCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperationCategoriesService],
    }).compile();

    service = module.get<OperationCategoriesService>(OperationCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
