import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TestAppModule } from './test.module';
import { TestDbService } from './db/test-db.service';
import { validationConfig } from '../../src/config/validation.config';

export class TestApp {
  public app: INestApplication;

  public get server(): any {
    if (!this.app) return undefined;
    return this.app.getHttpServer();
  }

  async start(): Promise<void> {
    const module = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    this.app = module.createNestApplication();
    this.app.useGlobalPipes(new ValidationPipe(validationConfig));
    await this.app.init();
  }
  async stop(): Promise<void> {
    await this.app.close();
  }

  async clearAllData(): Promise<void> {
    const service = await this.app.resolve(TestDbService);
    await service.clearAll();
  }
}
