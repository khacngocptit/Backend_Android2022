import { Global, Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { NotificationRepository } from "./notification.repository";
import { NotificationService } from "./service/notification.service";
import { NotifyReadService } from "./service/notify-read.service";
import { TopicService } from "./service/topic.service";

@Global()
@Module({
    providers: [TopicService, NotificationService, NotificationRepository, NotifyReadService],
    controllers: [NotificationController],
    exports: [TopicService, NotificationService, NotificationRepository],
})
export class NotificationModule {}
