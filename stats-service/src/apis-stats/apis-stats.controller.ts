import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApisStatsService } from './apis-stats.service';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ApiEntities } from './entities/ApiEntities';
import { UsageLogEntities } from './entities/UsageLogEntities';

@Controller('apis-stats')
export class ApisStatsController {
  constructor(
    private readonly apisStatsService: ApisStatsService,
    @InjectRepository(ApiEntities)
    private readonly apiRepository: Repository<ApiEntities>,
    @InjectRepository(UsageLogEntities)
    private readonly usageLogRepository: Repository<UsageLogEntities>,
  ) {}

  @Get()
  findAll() {
    return ['example'];
    return this.apisStatsService.findAll();
  }

  @Get('/logs')
  async countLogs() {
    const logsCount = await this.usageLogRepository.count();

    return logsCount;
  }
  @Get('/app/:id')
  async findOne(@Param('id') id: string) {
    const categoryDb = await this.apiRepository.findOneBy({ id });

    return categoryDb;
  }
}
