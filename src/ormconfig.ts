import config from './configs/config';

import { ConnectionOptions } from 'typeorm';

const connectionConfig: ConnectionOptions = {
    type: 'postgres',
    host: config.db.host,
    port: 5432,
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    synchronize: true,
    entities: [
        'dist/entities/**/*.js'
    ],
    migrations: [
        'dist/migrations/**/*.js'
    ],
    subscribers: [
        'dist/subscribers/**/*.js'
    ],
    cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migrations',
        subscribersDir: 'src/subscribers'
    }
};

export default connectionConfig;