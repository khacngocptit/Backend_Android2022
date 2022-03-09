import { Logger } from "@nestjs/common";

export enum Environment {
    PRODUCTION = "production",
    STAGING = "staging",
    DEVELOPMENT = "development",
}

const logger = new Logger("Configuration");

export const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
        logger.warn(`${key} not found`);
    }
    return value;
};

export interface AWSConfiguration {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
}

export interface Configuration {
    project: {
        name: string;
        defaultAdminPassword: string;
    };
    server: {
        port: number;
        address: string;
        swaggerPath: string;
        env: Environment;
    };
    database: {
        host: string;
        port: number;
        username?: string;
        password?: string;
        name: string;
    };
    jwt: {
        secret: string;
        exp: number;
    };
    aws?: AWSConfiguration;
    oneSignal: {
        appId: string;
        apiKey: string;
    };
    redis: {
        host: string;
        port: number;
        password: string;
    };
}

export default (): Configuration => {
    // Project
    const project = {
        name: getEnv("PROJECT_NAME"),
        defaultAdminPassword: getEnv("PROJECT_DEFAULT_ADMIN_PASSWORD") || "password",
        defaultUserPassword: getEnv("PROJECT_DEFAULT_USER_PASSWORD") || "password",
    };
    // Environment
    const env = getEnv("SERVER_ENV") as Environment;

    // Server
    const serverPort = parseInt(getEnv("SERVER_PORT"), 10) || 3000;
    const serverAddress = getEnv("SERVER_ADDRESS") || `http://localhost:${serverPort}`;
    const serverSwaggerPath = getEnv("SERVER_SWAGGER_PATH") || "api";

    // Database
    const databaseHost = encodeURI(getEnv("DB_HOST"));
    const databasePort = parseInt(getEnv("DB_PORT"), 10);
    const databaseUsername = getEnv("DB_USER");
    const databasePassword = getEnv("DB_PASSWORD");
    const databaseName = getEnv("DB_NAME");

    // JWT
    const jwtSecret = getEnv("JWT_SECRET");
    const jwtExp = getEnv("JWT_EXP");

    // AWS
    let aws: { region: string; accessKeyId: string; secretAccessKey: string };
    const awsRegion = getEnv("AWS_REGION");
    const awsAccessKeyId = getEnv("AWS_ACCESS_KEY_ID");
    const awsSecretAccessKey = getEnv("AWS_SECRET_ACCESS_KEY");
    if (awsRegion && awsAccessKeyId && awsSecretAccessKey) {
        aws = {
            region: awsRegion,
            accessKeyId: awsAccessKeyId,
            secretAccessKey: awsSecretAccessKey,
        };
    }

    // ONE SIGNAL
    const oneSignal = {
        appId: getEnv("ONE_SIGNAL_APP_ID"),
        apiKey: getEnv("ONE_SIGNAL_API_KEY"),
    };

    // REDIS
    const redis = {
        host: getEnv("REDIS_HOST"),
        port: Number(getEnv("REDIS_PORT")),
        password: getEnv("REDIS_PASSWORD"),
    };

    // MINIO
    const minioEndpoint = getEnv("MINIO_ENDPOINT");
    const minioPort = parseInt(getEnv("MINIO_PORT"));
    const minioAccessKey = getEnv("MINIO_ACCESS_KEY");
    const minioSecretKey = getEnv("MINIO_SECRET_KEY");

    const minioBucketName = getEnv("MINIO_BUCKET_NAME");

    return {
        project,
        server: {
            port: serverPort,
            address: serverAddress,
            swaggerPath: serverSwaggerPath,
            env,
        },
        database: {
            host: databaseHost,
            port: databasePort,
            username: databaseUsername,
            password: databasePassword,
            name: databaseName,
        },
        jwt: {
            secret: jwtSecret,
            exp: jwtExp && parseInt(jwtExp, 10),
        },
        aws,
        oneSignal,
        redis,
    };
};
