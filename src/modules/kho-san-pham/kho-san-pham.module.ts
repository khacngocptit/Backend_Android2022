import { Module } from "@nestjs/common";
import { KhoSanPhamController } from "./kho-san-pham.controller";
import { KhoSanPhamService } from "./kho-san-pham.service";

@Module({
  controllers: [KhoSanPhamController],
  providers: [KhoSanPhamService],
})
export class KhoSanPhamModule { }
