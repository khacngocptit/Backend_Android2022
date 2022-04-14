import { PartialType } from "@nestjs/swagger";
import { CuaHang } from "../entities/cua-hang.entity";

export class CreateCuaHangDto extends PartialType(CuaHang) { }