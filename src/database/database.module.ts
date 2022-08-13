import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { NestPgpromiseModule } from 'nest-pgpromise';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestPgpromiseModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          user: configService.get<string>('DATABASE_USER'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          host: configService.get<string>('DATABASE_HOST'),
          database: configService.get<string>('DATABASE_NAME'),
          port: parseInt(configService.get<string>('DATABASE_PORT'), 10),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
