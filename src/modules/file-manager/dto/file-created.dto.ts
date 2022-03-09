import { FileManager } from "../entities/file-manager.entity";

export class FileCreatedDto {
    url: string;
    file: FileManager;
}
