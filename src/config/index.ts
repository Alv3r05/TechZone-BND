import 'dotenv/config';

export interface AppConfig {
    mysql: {
        host: string;
        user: string;
        password: string;
        database: string;
        port: number;
    };
    app: {
        port: number;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
}

const config: AppConfig = {
    mysql: {
        host: process.env.MYSQL_HOST || '',
        user: process.env.MYSQL_USER || '',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || '',
        port: Number(process.env.MYSQL_PORT) || 17988,
    },
    app: {
        port: Number(process.env.PORT) || 3000,
    },
    jwt: {
        secret: process.env.JWT_SECRET || '',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
};

export default config;
