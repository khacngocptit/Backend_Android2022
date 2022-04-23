import { Test, TestingModule } from '@nestjs/testing';
import { DanhMucSanPhamService } from './danh-muc-san-pham.service';

describe('DanhMucSanPhamService', () => {
  let service: DanhMucSanPhamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DanhMucSanPhamService],
    }).compile();

    service = module.get<DanhMucSanPhamService>(DanhMucSanPhamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
