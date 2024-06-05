import { PartialType } from '@nestjs/swagger';
import { CreateApisStatDto } from './create-apis-stat.dto';

export class UpdateApisStatDto extends PartialType(CreateApisStatDto) {}
