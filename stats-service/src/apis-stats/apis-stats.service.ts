import { Injectable } from '@nestjs/common';
import { CreateApisStatDto } from './dto/create-apis-stat.dto';
import { UpdateApisStatDto } from './dto/update-apis-stat.dto';

@Injectable()
export class ApisStatsService {
  create(createApisStatDto: CreateApisStatDto) {
    return 'This action adds a new apisStat';
  }

  findAll() {
    return `This action returns all apisStats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} apisStat`;
  }

  update(id: number, updateApisStatDto: UpdateApisStatDto) {
    return `This action updates a #${id} apisStat`;
  }

  remove(id: number) {
    return `This action removes a #${id} apisStat`;
  }
}
