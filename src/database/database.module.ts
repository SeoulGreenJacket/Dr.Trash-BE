import { Module, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Pool } from 'pg';
import { DatabaseService } from './database.service';

@Module({
  providers: [
    DatabaseService,
    {
      provide: 'DATABASE_POOL',
      useFactory: () => {
        const {
          DATABASE_USER: user,
          DATABASE_HOST: host,
          DATABASE_NAME: database,
          DATABASE_PASSWORD: password,
          DATABASE_PORT: port,
        } = process.env;
        return new Pool({ user, host, database, password, port: +port });
      },
    },
  ],
  exports: [DatabaseService],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  onApplicationShutdown() {
    this.moduleRef.get<Pool>('DATABASE_POOL').end();
  }
}
