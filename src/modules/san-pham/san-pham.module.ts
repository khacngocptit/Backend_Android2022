import { Module } from "@nestjs/common";
import { KhoSanPhamService } from "../kho-san-pham/kho-san-pham.service";
import { SanPhamController } from "./san-pham.controller";
import { SanPhamService } from "./san-pham.service";

@Module({
  controllers: [SanPhamController],
  providers: [SanPhamService, KhoSanPhamService],
})
export class SanPhamModule { }
