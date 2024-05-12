import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import * as path from 'path';

const baseDir = path.join(__dirname, '..');
const migrationPath = path.join(baseDir, 'migrations');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DB,
  port: +(process.env.DB_PORT || 5432),
  autoLoadEntities: true,
  migrations: [migrationPath + '/*.ts'],
  migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
};
