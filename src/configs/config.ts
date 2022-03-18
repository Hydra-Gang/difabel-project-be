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
    }
};

export default config;