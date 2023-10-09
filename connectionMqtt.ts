import * as amqp from "amqplib";

import { connectOptionsType } from "./Types/connectionOption";

import { messagePayloadASArg } from "./Types/messagePayloadASArg";

import { rabbitMqConnectionType } from "./Types/rabbitMqConnectionType";

import tryStringifyJSONObject from "./helpers/tryStringifyJSONObject";

import createBuffer from "./helpers/createBuffer";

const LOGGER = (function () {
  let rabbitMqConnection: rabbitMqConnectionType = null;
  let logsQueueName: string = "logs";
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
      appName = "N/A",
      callBacks?: {
        onErrorCallback?: (error: Error) => any;
        onDisconnectCallback?: Function;
        onConnectCallback?: Function;
      }
    ): Promise<rabbitMqConnectionType | undefined> {
      disableAll = extraOptions?.disableAll ?? false;
      isDebugLogsEnabled = extraOptions?.enableDebug ?? true;
      isErrorLogsEnabled = extraOptions?.enableError ?? true;
      enableReconnect = extraOptions?.enableReconnect ?? true;
      reconnectTimeout = extraOptions?.reconnectTimeout || 30000;
      isLogOnly = extraOptions?.logOnly ?? false;
      app_name = appName;
      logsQueueName = queueName;
      try {
        if (disableAll || isLogOnly) {
          return (rabbitMqConnection = null);
        }

        const conn = await amqp.connect(option);

        conn?.once("error", (error) => {
          disableAll = true;
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
                    ...extraOptions,
                  },
                  app_name,
                  {
                    onConnectCallback: callBacks?.onConnectCallback,
                    onDisconnectCallback: callBacks?.onDisconnectCallback,
                    onErrorCallback: callBacks?.onErrorCallback,
                  }
                );
              } catch (error) {
                throw new Error(
                  "Error in reconnect from connection error event : " +
                    error?.message
                );
              }
            }, reconnectTimeout);
          }
        });

        conn?.on("close", () => {
          try {
            if (enableReconnect) {
              conn?.emit("error", "Logger rabbit mq connection closed ");
            }
          } catch (error) {
            throw new Error(
              "Error from close event in connection rabbitMQ :" + error?.message
            );
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
          try {
            conn?.close();
            callBacks?.onDisconnectCallback &&
              callBacks?.onDisconnectCallback();
            console.log(
              "=============== imxNodeLogger disconnected =============== "
            );
          } catch (error) {
            throw new Error("Error in disconnect event : " + error?.message);
          }
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
          disableAll = true;

          if (conn) {
            logsChannel?.close();
            conn?.emit("error", error);
            return;
          }

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
                    ...extraOptions,
                  },
                  app_name,
                  {
                    onConnectCallback: callBacks?.onConnectCallback,
                    onDisconnectCallback: callBacks?.onDisconnectCallback,
                    onErrorCallback: callBacks?.onErrorCallback,
                  }
                );
              } catch (error) {
                throw new Error(
                  "Error createConnectionToRabbitMQ reconnect in logChannel error event : " +
                    error?.message
                );
              }
            }, reconnectTimeout);
          }
        });

        logsChannel.on("close", () => {
          console.error("Error in logChannel event (close)  : Channel Closed ");
          if (enableReconnect) {
            logsChannel
              ? logsChannel?.emit("error", "Channel Closed :")
              : conn && conn?.emit("error", "Channel Closed");
          }
        });

        logsChannel.on("return", function (msg) {
          return;
        });

        logsChannel.on("drain", function () {
          return;
        });

        rabbitMqConnection = {
          amqpConnection: conn,

          channelConnection: logsChannel,

          error(payload: messagePayloadASArg) {
            if (!logsChannel) {
              console.error(
                "Channel is not available => Cannot send error log."
              );
              return;
            }
            try {
              logsChannel?.sendToQueue(
                logsQueueName,
                createBuffer(
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
              if (disableAll || !isErrorLogsEnabled) return;
              console.error({
                ...payload,
                level: "errors",
                date: new Date(),
                appName: app_name,
              });
            }
          },

          debug(payload: messagePayloadASArg) {
            if (!logsChannel) {
              console.error("Channel is not available. Cannot send error log.");
              return;
            }

            try {
              logsChannel?.sendToQueue(
                logsQueueName,
                createBuffer(
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
              if (disableAll || !isDebugLogsEnabled) return;

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
        disableAll = true;
        console.error(
          "Erreur in createConnectionToRabbitMQ : " + error?.message,
          error
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
                  ...extraOptions,
                },
                app_name,
                {
                  ...callBacks,
                }
              );
            } catch (error) {
              console.error(
                "Error in reconnect from connection catch : " + error?.message
              );
            }
          }, reconnectTimeout);
        }
      }
    },

    getConnectionObject() {
      return rabbitMqConnection;
    },

    getAllExtraOptions() {
      return {
        enableDebug: isDebugLogsEnabled,
        enableError: isErrorLogsEnabled,
        enableReconnect: enableReconnect,
        reconnectTimeout: reconnectTimeout,
        logOnly: isLogOnly,
        disableAll: disableAll,
      };
    },

    enableDisableAllLogging() {
      disableAll = true;
    },

    disbaleDisableAllLogging() {
      disableAll = false;
    },

    checkDisableAllLoggingStatus() {
      return disableAll;
    },

    enableLogOngly() {
      isLogOnly = true;
    },

    disableLogOngly() {
      isLogOnly = false;
    },

    checkLogOnglyStatus() {
      return isLogOnly;
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
      if (isLogOnly) {
        console.error(payload);
      }
      rabbitMqConnection?.error(payload);
    },

    debug(payload: messagePayloadASArg) {
      if (disableAll || !isDebugLogsEnabled) return;
      if (isLogOnly) {
        console.log(payload);
      }
      rabbitMqConnection?.debug(payload);
    },

    disconnectFromLogger() {
      if (!rabbitMqConnection) {
        return;
      }
      try {
        rabbitMqConnection?.amqpConnection?.emit("disconnected");
      } catch (error) {
        console.warn(
          "Error with disconnect function : " + error?.message,
          error
        );
      }
    },
  };
})();

export default LOGGER;
