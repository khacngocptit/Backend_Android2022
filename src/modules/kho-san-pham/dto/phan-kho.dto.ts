import { PartialType } from "@nestjs/swagger";
import { KhoSanPham } from "../entities/kho-san-pham.entity";

export class PhanKhoDto extends PartialType(KhoSanPham) { }