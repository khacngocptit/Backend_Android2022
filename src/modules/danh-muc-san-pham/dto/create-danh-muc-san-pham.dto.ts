import { PartialType } from "@nestjs/swagger";
import { DanhMucSanPham } from "../entities/danh-muc-san-pham.entity";

export class CreateDanhMucSanPhamDto extends PartialType(DanhMucSanPham) { }