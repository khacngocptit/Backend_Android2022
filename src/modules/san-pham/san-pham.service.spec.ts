import { Test, TestingModule } from '@nestjs/testing';
import { SanPhamService } from './san-pham.service';

describe('SanPhamService', () => {
  let service: SanPhamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SanPhamService],
    }).compile();

    service = module.get<SanPhamService>(SanPhamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
