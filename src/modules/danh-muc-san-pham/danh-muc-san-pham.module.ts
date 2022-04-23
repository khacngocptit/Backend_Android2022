import { Module } from '@nestjs/common';
import { DanhMucSanPhamController } from './danh-muc-san-pham.controller';
import { DanhMucSanPhamService } from './danh-muc-san-pham.service';

@Module({
  controllers: [DanhMucSanPhamController],
  providers: [DanhMucSanPhamService]
})
export class DanhMucSanPhamModule {}
