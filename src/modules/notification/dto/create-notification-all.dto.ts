import { PickType } from "@nestjs/swagger";
import { Notification } from "../entities/notification.entity";

export class CreateNotificationAll extends PickType(Notification, [
    "title",
    "description",
    "htmlContent",
    "content",
    "imageUrl",
]) {}
