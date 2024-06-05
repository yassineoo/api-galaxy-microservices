import { Test, TestingModule } from '@nestjs/testing';
import { ApisStatsController } from './apis-stats.controller';
import { ApisStatsService } from './apis-stats.service';

describe('ApisStatsController', () => {
  let controller: ApisStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApisStatsController],
      providers: [ApisStatsService],
    }).compile();

    controller = module.get<ApisStatsController>(ApisStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
