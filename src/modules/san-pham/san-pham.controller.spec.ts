import { Test, TestingModule } from '@nestjs/testing';
import { SanPhamController } from './san-pham.controller';

describe('SanPhamController', () => {
  let controller: SanPhamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SanPhamController],
    }).compile();

    controller = module.get<SanPhamController>(SanPhamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
