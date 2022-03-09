import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Request, Response } from "express";
import * as fs from "fs";
import { Model } from "mongoose";
import * as path from "path";
import { JwtPayload } from "../../auth/dto/jwt-payload";
import { DB_FILE_MANAGER } from "../../repository/db-collection";
import { FileManagerDocument } from "../entities/file-manager.entity";

@Injectable()
export class FileRetrieveService {
    constructor(
        @InjectModel(DB_FILE_MANAGER)
        private readonly fileManagerModel: Model<FileManagerDocument>,

        private readonly jwtService: JwtService,
    ) {}

    private validateJwt(bearerToken: string): JwtPayload {
        if (bearerToken?.startsWith("Bearer ")) {
            const jwt = bearerToken.substr(7);
            try {
                return this.jwtService.verify(jwt);
            } catch (err) {
                throw new UnauthorizedException();
            }
        } else {
            throw new UnauthorizedException();
        }
    }

    async retrieveFile(fileId: string, req: Request, res: Response): Promise<void> {
        const retrievedFile = await this.fileManagerModel.findById(fileId);
        if (!retrievedFile) {
            throw new NotFoundException();
        }
        const filePath = path.join(__dirname, "../../../..", retrievedFile.path);

        if (retrievedFile.public === false) {
            const payload = this.validateJwt(req.headers.authorization);
            // TODO: Implement authorization
        }

        const ext = path.extname(path.basename(retrievedFile.path));
        const newFilename = `${retrievedFile.filename}${ext}`;

        res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
        res.setHeader("Content-Type", retrievedFile.mimetype);
        res.setHeader("Content-Disposition", `filename="${encodeURIComponent(newFilename)}"`);

        const readStream = fs.createReadStream(filePath).on("error", () => {
            res.status(HttpStatus.NOT_FOUND).send("not-found");
        });
        readStream.pipe(res).on("error", () => {
            res.status(HttpStatus.NOT_FOUND).send("not-found");
        });
    }
}
