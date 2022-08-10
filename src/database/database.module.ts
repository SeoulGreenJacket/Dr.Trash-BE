import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { NestPgpromiseModule, NestPgpromiseOptions } from 'nest-pgpromise';

@Module({
  imports: [
    NestPgpromiseModule.register({
      user: process.env.USER,
      password: process.env.PASSWORD,
      host: process.env.HOST,
      database: process.env.DATABASE,
      port: 5000,
    } as NestPgpromiseOptions),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
