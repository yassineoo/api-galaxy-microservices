import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpLoggingInteceptor } from './shared/http-logging.interceptor';
import { ApisStatsModule } from './apis-stats/apis-stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ApisStatsModule,

    // ItemsModule,
  ],
  controllers: [],
  providers: [{ provide: APP_INTERCEPTOR, useClass: HttpLoggingInteceptor }],
})
export class AppModule {}
