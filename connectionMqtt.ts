import * as amqp from "amqplib";

import { connectOptionsType } from "./Types/connectionOption";

import { messagePayloadASArg } from "./Types/messagePayloadASArg";

import { rabbitMqConnectionType } from "./Types/rabbitMqConnectionType";

import tryStringifyJSONObject from "./helpers/tryStringifyJSONObject";

const LOGGER = (function () {
  let rabbitMqConnection: rabbitMqConnectionType = null;

  let logsQueueName: string = "";

  let isLogOnly: boolean = false;

  let disableAll: boolean = false;

  let isDebugLogsEnabled: boolean = true;

  let isErrorLogsEnabled: boolean = true;

  let enableReconnect: boolean = true;

  let reconnectTimeout: number = 30000;

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
        logOnly?: boolean;
        disableAll?: boolean;
      },
      appName?: string,
      callBacks?: {
        onErrorCallback?: (error: Error) => any;
        onDisconnectCallback?: Function;
        onConnectCallback?: Function;
      }
    ): Promise<rabbitMqConnectionType | undefined> {
      try {
        disableAll = extraOptions?.disableAll ?? false;

        isDebugLogsEnabled = extraOptions?.enableDebug ?? true;

        isErrorLogsEnabled = extraOptions?.enableError ?? true;

        enableReconnect = extraOptions?.enableReconnect ?? true;

        reconnectTimeout = extraOptions?.reconnectTimeout || 30000;

        isLogOnly = extraOptions?.logOnly ?? false;

        app_name = appName || "N/A";

        logsQueueName = queueName || "logs";

        if (disableAll || isLogOnly) {
          return (rabbitMqConnection = null);
        }

        const conn = await amqp.connect(option);

        conn?.once("error", (error) => {
          callBacks?.onErrorCallback && callBacks?.onErrorCallback(error);
          console.error(
            "Erreur in createConnectionToRabbitMQ  from imxNodeLogger: ",
            error?.message
          );
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
                await LOGGER.createConnectionToRabbitMQ(
                  option,
                  queueName,
                  {
                    enableDebug: extraOptions?.enableDebug,
                    enableError: extraOptions?.enableError,
                    enableReconnect: extraOptions?.enableReconnect,
                    reconnectTimeout: extraOptions?.reconnectTimeout,
                    logOnly: extraOptions?.logOnly,
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

        conn?.on("close", () => {
          try {
            if (enableReconnect) {
              conn?.emit("error", "Logger connection closed ");
            }
          } catch (error) {
            throw new Error(error?.message);
          }
        });

        conn?.on("blocked", (reason) => {
          console.error(
            "Connection to RabbitMQ is blocked for  (will disable logs until connection will be unblocked): " +
              reason
          );
          disableAll = true;
        });

        conn?.on("unblocked", () => {
          console.log("Connection to RabbitMQ is unblocked ");
          disableAll = false;
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
            "==================== Connected to imx Logger successfully  ======================="
          );
        });

        const logsChannel = await conn?.createChannel();

        await logsChannel?.checkQueue(logsQueueName);

        logsChannel.once("error", (error) => {
          console.error(
            "Erreur in createConnectionToRabbitMQ : Channel Error ",
            error?.message
          );
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
                await LOGGER.createConnectionToRabbitMQ(
                  option,
                  queueName,
                  {
                    enableDebug: extraOptions?.enableDebug,
                    enableError: extraOptions?.enableError,
                    enableReconnect: extraOptions?.enableReconnect,
                    reconnectTimeout: extraOptions?.reconnectTimeout,
                    logOnly: extraOptions?.logOnly,
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

        logsChannel.on("close", () => {
          console.error(
            "Erreur in createConnectionToRabbitMQ : Channel Closed "
          );
          if (enableReconnect) {
            logsChannel
              ? logsChannel?.emit("error", { message: "Channel Closed" })
              : conn && conn?.emit("error", { message: "Channel Closed" });
          }
        });

        logsChannel.on("return", function (msg) {});

        logsChannel.on("drain", function () {});

        rabbitMqConnection = {
          amqpConnection: conn,

          channelConnection: logsChannel,

          error(payload: messagePayloadASArg) {
            if (!isErrorLogsEnabled) return;
            if (!logsChannel) {
              console.error("Channel is not available. Cannot send error log.");
              return;
            }
            try {
              logsChannel?.sendToQueue(
                logsQueueName,
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
              /*
               ***** Add Catch Exception Logic
               ***** TO DO
               */
              // logsChannel
              //   ? logsChannel?.emit("error", error)
              //   : conn && conn?.emit("error", error);
              // console.error("Error sending debug logs : ", error?.message);
              console.error({
                ...payload,
                level: "errors",
                date: new Date(),
                appName: app_name,
              });
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
                logsQueueName,
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
              /*
               ***** Add Catch Exception Logic
               ***** TO DO
               */
              // logsChannel
              //   ? logsChannel?.emit("error", error)
              //   : conn && conn?.emit("error", error);
              // console.error("Error sending debug logs : ", error?.message);
              console.log({
                ...payload,
                level: "debug",
                date: new Date(),
                appName: app_name,
              });
            }
          },
        };

        conn?.emit("connected");

        return rabbitMqConnection;
      } catch (error) {
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
              await LOGGER.createConnectionToRabbitMQ(
                option,
                queueName,
                {
                  enableDebug: extraOptions?.enableDebug,
                  enableError: extraOptions?.enableError,
                  enableReconnect: extraOptions?.enableReconnect,
                  reconnectTimeout: extraOptions?.reconnectTimeout,
                  logOnly: extraOptions?.logOnly,
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
      app_name = appName;
    },

    error(payload: messagePayloadASArg) {
      if (disableAll || !isErrorLogsEnabled) return;
      if (!rabbitMqConnection && !isLogOnly) {
        console.error(payload);
        return;
      }
      rabbitMqConnection?.error(payload);
    },

    debug(payload: messagePayloadASArg) {
      if (disableAll || !isDebugLogsEnabled) return;
      if (!rabbitMqConnection && !isLogOnly) {
        console.log(payload);
        return;
      }
      rabbitMqConnection?.debug(payload);
    },
  };
})();

export default LOGGER;
