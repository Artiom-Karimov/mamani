import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

import { typeOrmConfig } from './typeorm.config';

const datasource = new DataSource(typeOrmConfig as DataSourceOptions);
datasource.initialize();
export default datasource;
