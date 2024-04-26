import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpLoggingInteceptor } from './shared/http-logging.interceptor';
import { AuthModule } from './auth/auth.module';
import { CarsModule } from './cars/cars.module';
import { BrandsModule } from './brands/brands.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    CarsModule,
    BrandsModule,
    // ItemsModule,
  ],
  controllers: [],
  providers: [{ provide: APP_INTERCEPTOR, useClass: HttpLoggingInteceptor }],
})
export class AppModule {}
