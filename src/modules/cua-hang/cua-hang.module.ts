import { Module } from '@nestjs/common';
import { CuaHangController } from './cua-hang.controller';
import { CuaHangService } from './cua-hang.service';

@Module({
  controllers: [CuaHangController],
  providers: [CuaHangService]
})
export class CuaHangModule {}
