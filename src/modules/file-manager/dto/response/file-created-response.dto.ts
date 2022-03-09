import { ResponseDto } from "../../../../common/dto/response/response.dto";
import { FileCreatedDto } from "../file-created.dto";

export class FileCreatedResponseDto extends ResponseDto<FileCreatedDto> {
    data: FileCreatedDto;
}
