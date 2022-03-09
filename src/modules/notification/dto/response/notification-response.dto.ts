import { ResponseDto } from "../../../../common/dto/response/response.dto";
import { Notification } from "../../entities/notification.entity";

export class NotificationResponse extends ResponseDto<Notification> {
    data: Notification;
}
