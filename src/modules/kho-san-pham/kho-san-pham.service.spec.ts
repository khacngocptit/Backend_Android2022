import { Test, TestingModule } from '@nestjs/testing';
import { KhoSanPhamService } from './kho-san-pham.service';

describe('KhoSanPhamService', () => {
  let service: KhoSanPhamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KhoSanPhamService],
    }).compile();

    service = module.get<KhoSanPhamService>(KhoSanPhamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
