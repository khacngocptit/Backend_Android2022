import { BullModule } from "@nestjs/bull";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { QueueName } from "../../config/constant";
import { OneSignalClient } from "./one-signal-client";
import { OneSignalQueueService } from "./one-signal-queue.service";
import { SendOneSignalProcessor } from "./one-signal.process";
import { OneSignalService } from "./one-signal.service";

@Global()
@Module({
    imports: [
        BullModule.registerQueueAsync({
            name: QueueName.ONE_SIGNAL,
            useFactory: async (configService: ConfigService) => ({
                redis: {
                    host: configService.get<string>("redis.host"),
                    port: configService.get<number>("redis.port"),
                    password: configService.get<string>("redis.password"),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [OneSignalClient, OneSignalService, SendOneSignalProcessor, OneSignalQueueService],
    exports: [OneSignalClient, OneSignalService],
})
export class OneSignalModule {}
