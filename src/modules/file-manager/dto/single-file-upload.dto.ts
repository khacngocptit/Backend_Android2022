import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsIn } from "class-validator";
import { FileManager } from "../entities/file-manager.entity";

export class SingleFileUploadDto extends PickType(FileManager, ["filename"]) {
    @IsIn(["true", "false"])
    @ApiProperty({ type: String, enum: ["true", "false"] })
    public: string | boolean;
    @ApiProperty({ type: "string", format: "binary" })
    file: any;
}
