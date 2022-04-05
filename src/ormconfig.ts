import 'reflect-metadata';
import config from './configs/config';

import { DataSource } from 'typeorm';

type ORMPathType = 'entities' | 'migrations' | 'subscribers';
const isDev = process.env.NODE_ENV === 'development';

/**
 * Provides the path to the specific ORM directories
 */
function pathToLoadORM(type: ORMPathType) {
    const startDir = (isDev ? 'src' : 'dist');
    const lastExtension = (isDev ? 'ts' : 'js');

    let middleExtension: string;
    switch (type) {
        case 'entities':
            middleExtension = 'entity';
            break;
        case 'migrations':
            middleExtension = 'migration';
            break;
        case 'subscribers':
            middleExtension = 'subscriber';
            break;
    }

    return `${startDir}/${type}/**/*.${middleExtension}.${lastExtension}`;
}

export const appDataSource = new DataSource({
    type: 'postgres',
    host: config.db.host,
    port: 5432,
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    synchronize: isDev,
    entities: [pathToLoadORM('entities')],
    migrations: [pathToLoadORM('migrations')],
    subscribers: [pathToLoadORM('subscribers')]
});