import 'reflect-metadata';
import config from './configs/config';

import { DataSource } from 'typeorm';

export const appDataSource = new DataSource({
    type: 'postgres',
    host: config.db.host,
    port: 5432,
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    synchronize: true,
    entities: ['dist/entities/**/*.js'],
    migrations: ['dist/migrations/**/*.js'],
    subscribers: ['dist/subscribers/**/*.js']
});