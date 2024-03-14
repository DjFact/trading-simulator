/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 14/03/2024 14:28
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel, ConsumeMessage } from 'amqplib';
import {
  ChannelWrapper,
  AmqpConnectionManager,
  connect,
} from 'amqp-connection-manager';

@Injectable()
export class MqService {
  protected connection: AmqpConnectionManager;
  protected publishChannel: ChannelWrapper;
  protected subscribeChannel: ChannelWrapper;

  protected pubDeclared: Set<string> = new Set();
  protected subDeclared: Set<string> = new Set();

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.connectToRabbitMQ();
    this.publishChannel = this.createChannel();
    this.subscribeChannel = this.createChannel();
  }

  async sendToQueue(queueName: string, data: any) {
    if (!this.pubDeclared.has(queueName)) {
      await this.publishChannel.addSetup((channel: Channel) => {
        channel.assertQueue(queueName, { durable: true });
        this.pubDeclared.add(queueName);
      });
    }

    await this.publishChannel.sendToQueue(queueName, data, {
      persistent: true,
    });
  }

  consumeMessages(
    queueName: string,
    onMessage: (msg: ConsumeMessage, channel: ChannelWrapper) => void,
  ) {
    this.subscribeChannel.addSetup(async (channel: Channel) => {
      if (!this.subDeclared.has(queueName)) {
        await channel.assertQueue(queueName, { durable: true });
        this.subDeclared.add(queueName);
      }
      await channel.consume(
        queueName,
        (msg: ConsumeMessage) => {
          this.logger.debug(
            `Received message from ${queueName}: ${msg.content.toString()}`,
          );
          onMessage(msg, this.subscribeChannel);
        },
        { noAck: false },
      );
    });
  }

  protected connectToRabbitMQ() {
    const urls = this.configService.get('mq');
    if (!urls) {
      throw new Error('RabbitMQ connection URL not found');
    }
    this.connection = connect(urls);
  }

  protected createChannel(): ChannelWrapper {
    return this.connection.createChannel({
      json: true,
      setup: () => Promise.resolve(),
    });
  }
}
