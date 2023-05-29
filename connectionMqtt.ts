import * as amqp from "amqplib";

import { connectOptionsType } from "./Types/connectionOption";
import { messagePayloadToMqTTFromUsers } from "./Types/messagePayloadType";
import { rabbitMqConnectionType } from "./Types/rabbitMqConnectionType";

const LOGGER = (function () {
  let rabbitMqConnection: rabbitMqConnectionType = null;

  let isDebugLogsEnabled: boolean = true;

  let isErrorLogsEnabled: boolean = true;

  let enableReconnect: boolean = true;

  let reconnectTimeout: number = 30000;

  let logsChannelName: string = "";

  return {
    async createConnectionToRabbitMQ(
      option: connectOptionsType,
      queueName: string,
      extraOptions: {
        enableDebug?: boolean;
        enableError?: boolean;
        enableReconnect?: boolean;
        reconnectTimeout?: number;
      }
    ): Promise<rabbitMqConnectionType> {
      try {
        isDebugLogsEnabled = extraOptions?.enableDebug ?? true;

        isErrorLogsEnabled = extraOptions?.enableError ?? true;

        enableReconnect = extraOptions?.enableReconnect ?? true;

        reconnectTimeout = extraOptions?.reconnectTimeout || 30000;

        const conn = await amqp.connect(option);

        conn.on("error", (error) => {
          console.error(
            "Erreur in createConnectionToRabbitMQ : ",
            error?.messgae
          );
          if (enableReconnect) {
            console.log(
              "=============== Retrying to reconnect to imxLogger in 30 sec ...... ==============="
            );
            setTimeout(async () => {
              console.log(
                "=============== Trying to reconnect to imxLogger.... ==============="
              );
              await LOGGER.createConnectionToRabbitMQ(option, queueName, {
                enableDebug: extraOptions?.enableDebug,
                enableError: extraOptions?.enableError,
                enableReconnect: extraOptions?.enableReconnect,
                reconnectTimeout: extraOptions?.reconnectTimeout,
              });
            }, reconnectTimeout);
          }
        });

        conn.on("disconnected", () => {
          console.log(
            "=============== imxNodeLogger disconnected =============== "
          );
        });

        conn.on("connected", () => {
          console.log(
            "=============== imxNodeLogger connected ==============="
          );
        });

        logsChannelName = queueName || "logs";

        const logsChannel = await conn.createChannel();

        await logsChannel.checkQueue(logsChannelName);

        console.log(
          "=============== Connected to imx Logger successfully  ==============="
        );

        rabbitMqConnection = {
          amqpConnection: conn,
          channelConnection: logsChannel,
          errorLoggingStatus: isErrorLogsEnabled,
          debugLoggingStatus: isDebugLogsEnabled,

          enableErrorLogging() {
            isErrorLogsEnabled = true;
          },
          disableErrorLogging() {
            isErrorLogsEnabled = false;
          },

          enableDebugLogging() {
            isDebugLogsEnabled = true;
          },

          disableDebugLogging() {
            isDebugLogsEnabled = false;
          },

          checkLoggingStatus() {
            return {
              errorLoggingStatus: isErrorLogsEnabled,
              debugLoggingStatus: isDebugLogsEnabled,
            };
          },

          checkErrorLoggingStatus() {
            return isErrorLogsEnabled;
          },

          checkDebugLoggingStatus() {
            return isDebugLogsEnabled;
          },

          error(payload: messagePayloadToMqTTFromUsers) {
            if (!isErrorLogsEnabled) return;
            logsChannel.sendToQueue(
              logsChannelName,
              Buffer.from(
                JSON.stringify({
                  payload: { ...payload, level: "errors", date: new Date() },
                })
              )
            );
          },

          debug(payload: messagePayloadToMqTTFromUsers) {
            if (!isDebugLogsEnabled) return;
            logsChannel.sendToQueue(
              logsChannelName,
              Buffer.from(
                JSON.stringify({
                  payload: { ...payload, level: "debug", date: new Date() },
                })
              )
            );
          },
        };
        return rabbitMqConnection;
      } catch (error) {
        console.error("Erreur in createConnectionToRabbitMQ : ", error);
        return error;
      }
    },

    getConnectionObject() {
      return rabbitMqConnection;
    },

    enableErrorLogging() {
      isErrorLogsEnabled = true;
    },
    disableErrorLogging() {
      isErrorLogsEnabled = false;
    },

    enableDebugLogging() {
      isDebugLogsEnabled = true;
    },

    disableDebugLogging() {
      isDebugLogsEnabled = false;
    },

    checkLoggingStatus() {
      return {
        errorLoggingStatus: isErrorLogsEnabled,
        debugLoggingStatus: isDebugLogsEnabled,
      };
    },

    checkErrorLoggingStatus() {
      return isErrorLogsEnabled;
    },

    checkDebugLoggingStatus() {
      return isDebugLogsEnabled;
    },

    error(payload: messagePayloadToMqTTFromUsers) {
      if (!isErrorLogsEnabled) return;
      rabbitMqConnection?.error(payload);
    },

    debug(payload: messagePayloadToMqTTFromUsers) {
      if (!isDebugLogsEnabled) return;
      rabbitMqConnection?.debug(payload);
    },
  };
})();

export default LOGGER;
