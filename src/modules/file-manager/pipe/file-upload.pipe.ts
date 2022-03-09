import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { SingleFileUploadDto } from "../dto/single-file-upload.dto";

export class FileUploadTransform implements PipeTransform<SingleFileUploadDto, SingleFileUploadDto> {
    transform(value: SingleFileUploadDto, metadata: ArgumentMetadata): SingleFileUploadDto {
        value.public = value.public === "true";
        return value;
    }
}
