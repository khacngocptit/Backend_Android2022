import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { getConnectionToken, getModelToken, Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { IsBoolean, IsIn, IsOptional, IsString, ValidateNested } from "class-validator";
import * as mongoose from "mongoose";
import { DB_FILE_MANAGER } from "../../repository/db-collection";
import { AllowMimeTypes, FilenameMatches, getFileUrl } from "../common/file-manager.constant";
import { Author, AuthorSchema } from "./author.entity";

@Schema({
    timestamps: true,
    collection: DB_FILE_MANAGER,
    toJSON: {
        getters: true,
    },
})
export class FileManager {
    @IsString()
    @FilenameMatches()
    @Prop({ required: true })
    filename: string;

    @IsBoolean()
    @IsOptional()
    @Prop({ default: () => false })
    public?: boolean;

    @IsString()
    @IsIn([...AllowMimeTypes.image, ...AllowMimeTypes.document])
    @Prop({ required: true })
    mimetype: string;

    @IsString()
    @Prop({ required: true })
    path: string;

    url?: string;

    @ValidateNested()
    @Type(() => Author)
    @Prop({ type: raw(AuthorSchema), required: true })
    author: Author;
}

const FileManagerSchema = SchemaFactory.createForClass(FileManager);
export type FileManagerDocument = FileManager & mongoose.Document;

export const FileManagerProvider: Provider = {
    provide: getModelToken(DB_FILE_MANAGER),
    useFactory: (configService: ConfigService, connection: mongoose.Connection): mongoose.Model<FileManagerDocument> => {
        FileManagerSchema.virtual("url").get(function () {
            const serverAddress = configService.get<string>("server.address");
            const fileId = this.get("_id");
            return getFileUrl(serverAddress, fileId);
        });
        return connection.model(DB_FILE_MANAGER, FileManagerSchema);
    },
    inject: [ConfigService, getConnectionToken()],
};
