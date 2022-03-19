import dotenv from 'dotenv';

dotenv.config();
const { env } = process;

const config = {
    jwt: {
        accessSecret: env.JWT_ACCESS_SECRET!,
        refreshSecret: env.JWT_REFRESH_SECRET!,
        expireTime: '15m',
        notBeforeTime: '3s'
    },
    hash: {
        rounds: 12
    },
    db: {
        host: env.DB_HOST!,
        database: env.DB_DATABASE!,
        username: env.DB_USERNAME!,
        password: env.DB_PASSWORD!
    }
};

export default config;