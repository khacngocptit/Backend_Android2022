import { Module } from '@nestjs/common';
import { SanPhamController } from './san-pham.controller';
import { SanPhamService } from './san-pham.service';

@Module({
  controllers: [SanPhamController],
  providers: [SanPhamService]
})
export class SanPhamModule {}
