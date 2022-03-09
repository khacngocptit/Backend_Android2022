import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpExceptionFilter } from "./common/exception/http-exception.filter";
import { TransformResponseInterceptor } from "./common/pipe/transform-response.intercepter";
import configuration from "./config/configuration";
import { MongooseConfigService } from "./config/mongodb-config.service";
import { AuthModule } from "./modules/auth/auth.module";
import { DeviceDataModule } from "./modules/device-data/device-data.module";
import { FileManagerModule } from "./modules/file-manager/module/file-manager.module";
import { NotificationModule } from "./modules/notification/notification.module";
import { OneSignalModule } from "./modules/one-signal/one-signal.module";
import { RepositoryModule } from "./modules/repository/repository.module";
import { SettingModule } from "./modules/setting/setting.module";
import { UserModule } from "./modules/user/user.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        MongooseModule.forRootAsync({
            useClass: MongooseConfigService,
            inject: [ConfigService],
        }),
        RepositoryModule,
        AuthModule,
        SettingModule,
        UserModule,
        // ProfileModule,
        SettingModule,
        FileManagerModule,
        DeviceDataModule,
        NotificationModule,
        OneSignalModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformResponseInterceptor,
        },
    ],
})
export class AppModule {}
