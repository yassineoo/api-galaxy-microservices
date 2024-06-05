import { INestApplication, Logger } from '@nestjs/common';

import { DataSource } from 'typeorm';

export async function seedUsers(dataSource: DataSource, app: INestApplication) {
  console.log('userAdmin');
}
