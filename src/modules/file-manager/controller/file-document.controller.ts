import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ApiBadRequestDoc } from "../../../common/decorator/api.decorator";
import { Authorization } from "../../../common/decorator/auth.decorator";
import { ReqUser } from "../../../common/decorator/user.decorator";
import { ResponseDto } from "../../../common/dto/response/response.dto";
import { UserDocument } from "../../user/entities/user.entity";
import { AllowMimeTypes, FileManagerError } from "../common/file-manager.constant";
import { MultipleFileUploadDto } from "../dto/multiple-file-upload.dto";
import { FileCreatedListResponseDto } from "../dto/response/file-created-list-response.dto";
import { FileCreatedResponseDto } from "../dto/response/file-created-response.dto";
import { SingleFileUploadDto } from "../dto/single-file-upload.dto";
import { FileUploadTransform } from "../pipe/file-upload.pipe";
import { FileUploadService } from "../service/file-upload.service";

@Controller("file/document")
@ApiTags("file-document")
@Authorization()
export class FileDocumentController {
    constructor(private readonly fileManagerService: FileUploadService) {}

    @Post("single")
    @ApiBadRequestDoc({
        errorCode: FileManagerError.BAD_REQUEST_INVALID_MIME_TYPE,
        errorDescription: `<p>Invalid document MIME types<p><p>Valid types:<ul>${AllowMimeTypes.document
            .map((t) => `<li>${t.type}</li>`)
            .join("")}<ul>`,
    })
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FileInterceptor("file"))
    async uploadImage(
        @ReqUser() user: UserDocument,
        @UploadedFile() file: Express.Multer.File,
        @Body(FileUploadTransform) doc: SingleFileUploadDto,
    ): Promise<FileCreatedResponseDto> {
        const data = await this.fileManagerService.createSingleFile(user, file, doc);
        return ResponseDto.create(data);
    }

    @Post("multiple")
    @ApiBadRequestDoc({
        errorCode: FileManagerError.BAD_REQUEST_INVALID_MIME_TYPE,
        errorDescription: `<p>Invalid document MIME types<p><p>Valid types:<ul>${AllowMimeTypes.document
            .map((t) => `<li>${t.type}</li>`)
            .join("")}<ul>`,
    })
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FilesInterceptor("files", 10))
    async uploadMultipleImage(
        @ReqUser() user: UserDocument,
        @UploadedFiles() filesUpload: Express.Multer.File[],
        @Body(FileUploadTransform) doc: MultipleFileUploadDto,
    ): Promise<FileCreatedListResponseDto> {
        const data = await this.fileManagerService.createMultipleFiles(user, filesUpload, doc);
        return ResponseDto.create(data);
    }
}
