import { Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Kafka } from 'kafkajs';
import { kafka } from 'src/common/environments';
import { KafkaService } from './kafka.service';

@Module({
  providers: [
    {
      provide: 'KAFKA_PRODUCER',
      useFactory: () => {
        return new Kafka({
          clientId: 'drtrash',
          brokers: [`${kafka.host}:${kafka.port}`],
        }).producer();
      },
    },
    {
      provide: 'KAFKA_CONSUMER',
      useFactory: () => {
        return new Kafka({
          clientId: 'drtrash',
          brokers: [`${kafka.host}:${kafka.port}`],
        }).consumer({ groupId: 'drtrash' });
      },
    },
    KafkaService,
  ],
  exports: [KafkaService],
})
export class KafkaModule {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationBootstrap() {
    await this.moduleRef.get('KAFKA_PRODUCER').connect();
    await this.moduleRef.get('KAFKA_CONSUMER').connect();
  }
}
