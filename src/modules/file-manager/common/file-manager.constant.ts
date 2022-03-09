import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Matches } from "class-validator";

export const UPLOAD_DIR = "upload";

export enum UploadType {
    IMAGE = "image",
    DOCUMENT = "document",
    DATA = "data",
}

const filenameRegex = /^[ 0-9a-z_\-aàáạảãâầấậẩẫăằắặẳẵeèéẹẻẽêềếệểễiìíịỉĩoòóọỏõôồốộổỗơờớợởỡuùúụủũưừứựửữyỳýỵỷỹdđ]{1,100}$/i;

export const FilenameMatches = () =>
    applyDecorators(
        Matches(filenameRegex),
        ApiProperty({ description: `regex: <pre>${JSON.stringify(String(filenameRegex)).slice(1, -1)}</pre>` }),
    );

export enum FileManagerError {
    BAD_REQUEST_INVALID_MIME_TYPE = "BAD_REQUEST_INVALID_MIME_TYPE",
}

export const AllowMimeTypes: { [key in "image" | "document" | "data"]: Array<{ ext: string; type: string }> } = {
    image: [
        { ext: "webp", type: "image/webp" },
        { ext: "bmp", type: "image/bmp" },
        { ext: "jpeg", type: "image/jpeg" },
        { ext: "png", type: "image/png" },
        { ext: "gif", type: "image/gif" },
    ],

    document: [
        { ext: "txt", type: "text/plain" },
        { ext: "pdf", type: "application/pdf" },
        { ext: "doc", type: "application/msword" },
        { ext: "docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
        { ext: "xls", type: "application/vnd.ms-excel" },
        { ext: "xlsx", type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
        { ext: "ppt", type: "application/vnd.ms-powerpoint" },
        { ext: "pptx", type: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
    ],

    data: [],
};

AllowMimeTypes.data = [...AllowMimeTypes.image, ...AllowMimeTypes.document];

export const getFileUrl = (serverAddress: string, fileId: string) => `${serverAddress}/file/${fileId}`;
