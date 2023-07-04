import * as amqp from "amqplib";

import { messagePayloadASArg } from "./messagePayloadASArg";

type LoggingStatus = {
  errorLoggingStatus: boolean;
  debugLoggingStatus: boolean;
};

export type rabbitMqConnectionType = {
  amqpConnection: amqp.Connection | null;
  channelConnection: amqp.Channel | null;
  errorLoggingStatus: boolean;
  debugLoggingStatus: boolean;
  error(payload: messagePayloadASArg): void;
  debug(payload: messagePayloadASArg): void;
  enableErrorLogging(): void;
  disableErrorLogging(): void;
  enableDebugLogging(): void;
  disableDebugLogging(): void;
  checkLoggingStatus(): LoggingStatus;
  checkErrorLoggingStatus(): boolean;
  checkDebugLoggingStatus(): boolean;
  setAppName(arg: string): void;
} | null;
