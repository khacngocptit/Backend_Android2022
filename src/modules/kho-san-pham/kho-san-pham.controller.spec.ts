import { Test, TestingModule } from '@nestjs/testing';
import { KhoSanPhamController } from './kho-san-pham.controller';

describe('KhoSanPhamController', () => {
  let controller: KhoSanPhamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KhoSanPhamController],
    }).compile();

    controller = module.get<KhoSanPhamController>(KhoSanPhamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
