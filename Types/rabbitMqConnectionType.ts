import * as amqp from "amqplib";

import { messagePayloadToMqTTFromUsers } from "./messagePayloadType";

export type rabbitMqConnectionType = {
  amqpConnection: amqp.Connection;
  channelConnection: amqp.Channel;
  isEnabled: boolean;
  error(payload: messagePayloadToMqTTFromUsers): void;
  debug(payload: messagePayloadToMqTTFromUsers): void;
  enableLogging(): void;
  disableLogging(): void;
  checkIsEnaled(): boolean;
} | null;
