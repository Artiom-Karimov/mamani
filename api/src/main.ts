import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { validationConfig } from './config/validation.config';

function setupSwagger(app: INestApplication, version: string, path: string) {
  const options = new DocumentBuilder()
    .setTitle('Mamani api')
    .setDescription('REST API for money tracking app')
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(path, app, document);
}

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(validationConfig));
  const config = app.get(ConfigService);
  const port = config.get('PORT') || 3000;

  const swaggerPath = config.get('SWAGGER_PATH') || 'api';
  const version = config.get('API_VERSION') || '0.0.1';
  setupSwagger(app, version, swaggerPath);

  await app.listen(port);
  const url = await app.getUrl();
  logger.log(`App is listenning on ${url}`);
  logger.log(`Swagger is listenning on ${url}/${swaggerPath}`);
}
bootstrap();
