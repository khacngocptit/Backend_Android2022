import { PickType } from "@nestjs/swagger";
import { Notification } from "../entities/notification.entity";

export class CreateNotification extends PickType(Notification, [
    "senderName",
    "senderId",
    "topicId",
    "title",
    "description",
    "content",
    "htmlContent",
    "imageUrl",
]) {}
