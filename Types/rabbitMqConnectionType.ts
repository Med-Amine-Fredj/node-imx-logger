import * as amqp from "amqplib";

import { messagePayloadASArg } from "./messagePayloadASArg";

export type rabbitMqConnectionType = {
  amqpConnection: amqp.Connection | null;
  channelConnection: amqp.Channel | null;
  error(payload: messagePayloadASArg): void;
  debug(payload: messagePayloadASArg): void;
} | null;
