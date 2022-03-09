import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import * as crypto from "crypto-js";
import * as multer from "multer";
import * as path from "path";
import * as uuid from "uuid";
import { ErrorData } from "../../../common/exception/error-data";
import { AllowMimeTypes, FileManagerError, UploadType, UPLOAD_DIR } from "../common/file-manager.constant";
import { FileDocumentController } from "../controller/file-document.controller";
import { FileUploadService } from "../service/file-upload.service";

@Module({
    imports: [
        MulterModule.register({
            storage: multer.diskStorage({
                destination: UPLOAD_DIR,
                filename: (req: Express.Request, file: Express.Multer.File, cb) => {
                    if (AllowMimeTypes.document.findIndex((t) => t.type === file.mimetype) === -1) {
                        return cb(ErrorData.BadRequest(FileManagerError.BAD_REQUEST_INVALID_MIME_TYPE), null);
                    }
                    const filename: string = crypto.SHA1(uuid.v4()).toString();
                    cb(null, `${UploadType.DOCUMENT}_${filename}${path.extname(file.originalname)}`);
                },
            }),
        }),
    ],
    providers: [FileUploadService],
    controllers: [FileDocumentController],
})
export class FileDocumentModule {}
