import { Controller, Get, Param, Req, Res } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { FileRetrieveService } from "../service/file-retrieve.service";

@Controller("file")
@ApiTags("file")
export class FileController {
    constructor(private readonly fileRetrieveService: FileRetrieveService) {}

    @Get(":fileId")
    @ApiBearerAuth()
    async retrieveFile(@Param("fileId") fileId: string, @Req() req: Request, @Res() res: Response): Promise<void> {
        await this.fileRetrieveService.retrieveFile(fileId, req, res);
    }
}
