import dotenv from 'dotenv';

dotenv.config();
const { env } = process;

const config = {
    jwt: {
        accessSecret: env.JWT_ACCESS_SECRET!,
        refreshSecret: env.JWT_REFRESH_SECRET!,

        accessExpire: '15m',
        refreshExpire: '30d',

        notBefore: '3s'
    },
    hashRounds: 12,
    db: {
        host: env.DB_HOST!,
        database: env.DB_DATABASE!,
        username: env.DB_USERNAME!,
        password: env.DB_PASSWORD!
    },
    development: (env.NODE_ENV === 'development')
};

export default config;