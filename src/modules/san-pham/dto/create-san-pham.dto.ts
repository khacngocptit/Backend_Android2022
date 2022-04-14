import { PartialType } from "@nestjs/swagger";
import { SanPham } from "../entities/san-pham.entity";

export class CreateSanPham extends PartialType(SanPham) { }