import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { NestPgpromiseModule, NestPgpromiseOptions } from 'nest-pgpromise';

@Module({
  imports: [
    NestPgpromiseModule.register({
      connection: {
        user: process.env.USER,
        password: process.env.PASSWORD,
        host: process.env.HOST,
        database: process.env.DATABASE,
        port: parseInt(process.env.DATABASE_PORT, 10),
      },
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
