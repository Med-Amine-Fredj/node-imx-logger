import * as amqp from "amqplib";

import { messagePayloadASArg } from "./messagePayloadASArg";

export type rabbitMqConnectionType =
  | {
      amqpConnection: amqp.Connection | null;
      channelConnection: amqp.Channel | null;
      error(payload: messagePayloadASArg): void | undefined;
      debug(payload: messagePayloadASArg): void | undefined;
    }
  | {
      amqpConnection: amqp.Connection | null;
      channelConnection: amqp.Channel | null;
    }
  | null
  | any;
