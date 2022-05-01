import { OmitType, PartialType } from "@nestjs/swagger";
import { LichSuKhoHang } from "../entities/lich-su-kho.entity";

export class NhapKhoDto extends PartialType(OmitType(LichSuKhoHang, [
    "isExport",
    "day",
    "month",
    "year",
])) { }