import { Test, TestingModule } from '@nestjs/testing';
import { CuaHangController } from './cua-hang.controller';

describe('CuaHangController', () => {
  let controller: CuaHangController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CuaHangController],
    }).compile();

    controller = module.get<CuaHangController>(CuaHangController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
