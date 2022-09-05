import { Module, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Pool } from 'pg';
import { database } from 'src/common/environments';
import { DatabaseService } from './database.service';

@Module({
  providers: [
    DatabaseService,
    {
      provide: 'DATABASE_POOL',
      useFactory: () => {
        return new Pool(database().config);
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
