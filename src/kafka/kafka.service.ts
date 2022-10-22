import { Inject, Injectable } from '@nestjs/common';
import { Producer } from 'kafkajs';

@Injectable()
export class KafkaService {
  constructor(@Inject('KAFKA_PRODUCER') private producer: Producer) {}

  async send(topic: string, message: string) {
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });
  }
}
