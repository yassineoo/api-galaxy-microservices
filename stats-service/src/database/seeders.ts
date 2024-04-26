import { INestApplication, Logger } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/types/userRole.enum';
import { UsersService } from 'src/users/users.service';

import { DataSource } from 'typeorm';

export async function seedUsers(dataSource: DataSource, app: INestApplication) {
  const userRepository = dataSource.getRepository(UserEntity);

  const userService = app.get(UsersService);

  const userAdmin = await userRepository.find();
  if (!userAdmin) {
    await userService.create({
      firstName: 'admin',
      familyName: 'admin',
      email: 'jy_attou@esi.dz',
      password: 'admin',
      phoneNumber: '+21374074589',
      role: UserRole.ADMIN,
      birthday: new Date(),
    });
  }
  console.log('userAdmin', userAdmin);
}
