import { IsOptional } from "class-validator";

export class DanhMucSanPhamCondition {
    @IsOptional()
    name: any;

    @IsOptional()
    description: any;
}