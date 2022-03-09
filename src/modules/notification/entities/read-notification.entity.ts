import { ObjectId } from "mongodb";
import { NotificationDocument } from "./notification.entity";

export class ReadNotification {
    participantId: string;
    notificationId: string | ObjectId | NotificationDocument;
}
