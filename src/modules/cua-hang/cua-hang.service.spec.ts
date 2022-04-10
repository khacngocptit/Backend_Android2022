import { Test, TestingModule } from '@nestjs/testing';
import { CuaHangService } from './cua-hang.service';

describe('CuaHangService', () => {
  let service: CuaHangService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CuaHangService],
    }).compile();

    service = module.get<CuaHangService>(CuaHangService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
