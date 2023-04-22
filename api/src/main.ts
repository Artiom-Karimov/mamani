import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Main');

  logger.log('Creating app...');
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('PORT') || 3000;
  await app.listen(port);
  logger.log(`App is listenning on port ${port}`);
}
bootstrap();
