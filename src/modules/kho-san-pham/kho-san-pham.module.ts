import { Module } from '@nestjs/common';
import { KhoSanPhamController } from './kho-san-pham.controller';

@Module({
  controllers: [KhoSanPhamController]
})
export class KhoSanPhamModule {}
