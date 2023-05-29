import * as amqp from "amqplib";

import { messagePayloadToMqTTFromUsers } from "./messagePayloadType";

type LoggingStatus = {
  errorLoggingStatus: boolean;
  debugLoggingStatus: boolean;
};

export type rabbitMqConnectionType = {
  amqpConnection: amqp.Connection;
  channelConnection: amqp.Channel;
  errorLoggingStatus: boolean;
  debugLoggingStatus: boolean;
  error(payload: messagePayloadToMqTTFromUsers): void;
  debug(payload: messagePayloadToMqTTFromUsers): void;
  enableErrorLogging(): void;
  disableErrorLogging(): void;
  enableDebugLogging(): void;
  disableDebugLogging(): void;
  checkLoggingStatus(): LoggingStatus;
  checkErrorLoggingStatus(): boolean;
  checkDebugLoggingStatus(): boolean;
} | null;
