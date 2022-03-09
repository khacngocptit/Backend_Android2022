import { accessibleFieldsPlugin, accessibleRecordsPlugin } from "@casl/mongoose";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { config as awsConfig } from "aws-sdk";
import { json, urlencoded } from "body-parser";
import * as helmet from "helmet";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import { AppModule } from "./app.module";
import { AWSConfiguration, Environment } from "./config/configuration";

async function bootstrap() {
    mongoose.plugin(accessibleRecordsPlugin);
    mongoose.plugin(accessibleFieldsPlugin);
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);
    const environment = configService.get<Environment>("server.env");
    const project = configService.get<{ name: string }>("project");
    const serverAddress = configService.get<string>("server.address");
    const swaggerPath = configService.get<string>("server.swaggerPath");

    // Body Parser
    app.use(json({ limit: "10mb" }));
    app.use(urlencoded({ limit: "10mb", extended: true }));

    // Validation
    app.useGlobalPipes(
        new ValidationPipe({
            disableErrorMessages: environment === Environment.PRODUCTION,
            whitelist: true,
        }),
    );

    // Swagger
    const swaggerConfig = new DocumentBuilder()
        .addServer(serverAddress)
        .addBearerAuth()
        .setTitle(project.name)
        .setVersion("0.0.1")
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(swaggerPath, app, document, {
        swaggerOptions: {
            displayRequestDuration: true,
            filter: true,
        },
    });

    // Security
    app.disable("x-powered-by");
    app.use(helmet());
    app.enableCors();

    // AWS
    const aws = configService.get<AWSConfiguration>("aws");
    if (aws) {
        awsConfig.update({
            region: aws.region,
            credentials: {
                accessKeyId: aws.accessKeyId,
                secretAccessKey: aws.secretAccessKey,
            },
        });
    }

    // Log Morgan
    app.use(morgan(environment === Environment.PRODUCTION ? "combined" : "dev"));

    const port = configService.get<number>("server.port");
    await app.listen(port);
}
bootstrap();
