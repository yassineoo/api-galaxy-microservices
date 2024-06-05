import { Test, TestingModule } from '@nestjs/testing';
import { ApisStatsService } from './apis-stats.service';

describe('ApisStatsService', () => {
  let service: ApisStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApisStatsService],
    }).compile();

    service = module.get<ApisStatsService>(ApisStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
