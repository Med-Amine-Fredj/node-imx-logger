import * as amqp from "amqplib";

import { connectOptionsType } from "./Types/connectionOption";

import { messagePayloadASArg } from "./Types/messagePayloadASArg";

import { rabbitMqConnectionType } from "./Types/rabbitMqConnectionType";
import tryStringifyJSONObject from "./helpers/tryStringifyJSONObject";

const LOGGER = (function () {
  let rabbitMqConnection: rabbitMqConnectionType = null;

  let isDebugLogsEnabled: boolean = true;

  let isErrorLogsEnabled: boolean = true;

  let enableReconnect: boolean = true;

  let reconnectTimeout: number = 30000;

  let logsChannelName: string = "";

  let app_name: string = "N/A";

  return {
    async createConnectionToRabbitMQ(
      option: connectOptionsType,
      queueName: string,
      extraOptions: {
        enableDebug?: boolean;
        enableError?: boolean;
        enableReconnect?: boolean;
        reconnectTimeout?: number;
      },
      appName?: string,
      callBacks?: {
        onErrorCallback?: (error: Error) => any;
        onDisconnectCallback?: Function;
        onConnectCallback?: Function;
      }
    ): Promise<rabbitMqConnectionType> {
      try {
        isDebugLogsEnabled = extraOptions?.enableDebug ?? true;

        isErrorLogsEnabled = extraOptions?.enableError ?? true;

        enableReconnect = extraOptions?.enableReconnect ?? true;

        reconnectTimeout = extraOptions?.reconnectTimeout || 30000;

        app_name = appName || "N/A";

        logsChannelName = queueName || "logs";

        const conn = await amqp.connect(option);

        conn?.on("error", (error) => {
          callBacks?.onErrorCallback && callBacks?.onErrorCallback(error);
          console.error("Erreur in createConnectionToRabbitMQ : ", error);
          if (enableReconnect) {
            console.log(
              "=============== Retrying to reconnect to imxLogger in " +
                reconnectTimeout +
                "MS ...... ==============="
            );
            setTimeout(async () => {
              console.log(
                "=============== Trying to reconnect to imxLogger.... ==============="
              );
              try {
                LOGGER.createConnectionToRabbitMQ(
                  option,
                  queueName,
                  {
                    enableDebug: extraOptions?.enableDebug,
                    enableError: extraOptions?.enableError,
                    enableReconnect: extraOptions?.enableReconnect,
                    reconnectTimeout: extraOptions?.reconnectTimeout,
                  },
                  app_name,
                  {
                    onConnectCallback: callBacks?.onConnectCallback,
                    onDisconnectCallback: callBacks?.onDisconnectCallback,
                    onErrorCallback: callBacks?.onErrorCallback,
                  }
                );
              } catch (error) {
                console.error("Error createConnectionToRabbitMQ", error);
              }
            }, reconnectTimeout);
          }
        });

        conn?.on("disconnected", () => {
          console.log(
            "=============== imxNodeLogger disconnected =============== "
          );
          callBacks?.onDisconnectCallback && callBacks?.onDisconnectCallback();
        });

        conn?.on("connected", () => {
          callBacks?.onConnectCallback && callBacks?.onConnectCallback();
          console.log(
            "=============== imxNodeLogger connected ==============="
          );
        });

        const logsChannel = await conn?.createChannel();

        await logsChannel?.checkQueue(logsChannelName);

        console.log(
          "==================== Connected to imx Logger successfully  ======================="
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

          setAppName(appName: string) {
            app_name = appName;
          },

          error(payload: messagePayloadASArg) {
            if (!isErrorLogsEnabled) return;
            if (!logsChannel) {
              console.error("Channel is not available. Cannot send error log.");
              return;
            }
            try {
              logsChannel?.sendToQueue(
                logsChannelName,
                Buffer.from(
                  tryStringifyJSONObject({
                    payload: {
                      ...payload,
                      level: "errors",
                      date: new Date(),
                      appName: app_name,
                    },
                  })
                )
              );
            } catch (error) {
              console.error("Error sending error logs : ", error);
            }
          },

          debug(payload: messagePayloadASArg) {
            if (!isDebugLogsEnabled) return;
            if (!logsChannel) {
              console.error("Channel is not available. Cannot send error log.");
              return;
            }
            try {
              logsChannel?.sendToQueue(
                logsChannelName,
                Buffer.from(
                  tryStringifyJSONObject({
                    payload: {
                      ...payload,
                      level: "debug",
                      date: new Date(),
                      appName: app_name,
                    },
                  })
                )
              );
            } catch (error) {
              console.error("Error sending debug logs : ", error);
            }
          },
        };
        return rabbitMqConnection;
      } catch (error) {
        console.error("Erreur in createConnectionToRabbitMQ : ", error);
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

    setAppName(appName: string) {
      rabbitMqConnection?.setAppName(appName);
    },

    error(payload: messagePayloadASArg) {
      if (!isErrorLogsEnabled) return;
      if (!rabbitMqConnection) {
        console.error("Connection to rabbitMq not established !");
        return;
      }
      rabbitMqConnection?.error(payload);
    },

    debug(payload: messagePayloadASArg) {
      if (!rabbitMqConnection) {
        console.error("Connection to rabbitMq not established !");
        return;
      }
      if (!isDebugLogsEnabled) return;
      rabbitMqConnection?.debug(payload);
    },
  };
})();

export default LOGGER;
