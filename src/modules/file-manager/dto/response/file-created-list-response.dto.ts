import { ResponseDto } from "../../../../common/dto/response/response.dto";
import { FileCreatedDto } from "../file-created.dto";

export class FileCreatedListResponseDto extends ResponseDto<FileCreatedDto[]> {
    data: FileCreatedDto[];
}
