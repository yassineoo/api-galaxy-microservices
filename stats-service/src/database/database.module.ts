import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // Change the type to 'postgres'
        host: configService.getOrThrow('POSTGRES_HOST'), // Update to use 'POSTGRES_HOST'
        port: configService.getOrThrow('POSTGRES_PORT'), // Update to use 'POSTGRES_PORT'
        database: configService.getOrThrow('POSTGRES_DATABASE'), // Update to use 'POSTGRES_DATABASE'
        username: configService.getOrThrow('POSTGRES_USERNAME'), // Update to use 'POSTGRES_USERNAME'
        password: configService.getOrThrow('POSTGRES_PASSWORD'), // Update to use 'POSTGRES_PASSWORD'
        autoLoadEntities: true,
        synchronize: configService.getOrThrow('POSTGRES_SYNCHRONIZE'), // Update to use 'POSTGRES_SYNCHRONIZE'
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
