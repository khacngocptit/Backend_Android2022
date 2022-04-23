import { Test, TestingModule } from '@nestjs/testing';
import { DanhMucSanPhamController } from './danh-muc-san-pham.controller';

describe('DanhMucSanPhamController', () => {
  let controller: DanhMucSanPhamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DanhMucSanPhamController],
    }).compile();

    controller = module.get<DanhMucSanPhamController>(DanhMucSanPhamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
