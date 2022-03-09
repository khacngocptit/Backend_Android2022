import { ResponseDto } from "../../../../common/dto/response/response.dto";
import { NotifyRead } from "../../entities/notify-read.entity";

export class NotifyReadResponse extends ResponseDto<NotifyRead> {
    data: NotifyRead;
}
