import { IsIn, IsOptional } from "class-validator";
import { ParamOption01 } from "../../../../common/types";

export class UploadFileParams {
    @IsIn(["0", "1"])
    @IsOptional()
    compress?: ParamOption01;
}
