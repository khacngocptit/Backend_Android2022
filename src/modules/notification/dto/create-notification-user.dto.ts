import { PickType } from "@nestjs/swagger";
import { Notification } from "../entities/notification.entity";

export class CreateNotificationUser extends PickType(Notification, [
    "title",
    "description",
    "htmlContent",
    "content",
    "imageUrl",
    "userIds",
]) {}
