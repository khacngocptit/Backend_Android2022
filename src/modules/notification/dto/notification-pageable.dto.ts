import { PageableDto } from "../../../common/dto/pageable.dto";

export class NotificationPageable extends PageableDto<Notification> {
    result: Notification[];
}
