import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";

export class MultipleFileUploadDto {
    @IsString()
    prefix: string;

    @IsIn(["true", "false"])
    @ApiProperty({ type: String, enum: ["true", "false"] })
    public: string | boolean;

    @ApiProperty({ type: "string", format: "binary" })
    files: any;
}
