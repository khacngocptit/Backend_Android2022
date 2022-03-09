import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as OneSignal from "onesignal-node";

export const ONE_SIGNAL_CLIENT = "ONE_SIGNAL_CLIENT";

export const OneSignalClient: Provider = {
    provide: ONE_SIGNAL_CLIENT,
    useFactory: (configService: ConfigService) => {
        const { appId, apiKey } = configService.get("oneSignal");
        return new OneSignal.Client(appId, apiKey);
    },
    inject: [ConfigService],
};
