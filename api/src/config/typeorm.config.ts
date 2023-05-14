import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../features/users/entities/user.entity';
import { Account } from '../features/accounts/entities/account.entity';

import * as path from 'path';
import { Category } from '../features/operation-categories/entities/category.entity';
import { Operation } from '../features/operations/entities/operation.entity';

const baseDir = path.join(__dirname, '..');
const migrationPath = path.join(baseDir, 'migrations');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DB,
  port: +(process.env.DB_PORT || 5432),
  entities: [User, Account, Category, Operation],
  migrations: [migrationPath + '/*.ts'],
  migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
};
