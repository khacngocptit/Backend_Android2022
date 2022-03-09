import { ResponseDto } from "../../../../common/dto/response/response.dto";
import { NotificationPageable } from "../notification-pageable.dto";

export class NotificationPageableResponse extends ResponseDto<NotificationPageable> {
    data: NotificationPageable;
}
