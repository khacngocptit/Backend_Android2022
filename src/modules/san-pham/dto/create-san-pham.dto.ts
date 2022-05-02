import { PartialType } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { SanPham } from "../entities/san-pham.entity";

export class CreateSanPham extends PartialType(SanPham) {
    @IsNumber()
    quality: number;
}