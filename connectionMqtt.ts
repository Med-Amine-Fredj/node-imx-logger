import * as amqp from "amqplib";

import { connectOptionsType } from "./Types/connectionOption";

import { messagePayloadASArg } from "./Types/messagePayloadASArg";

import { rabbitMqConnectionType } from "./Types/rabbitMqConnectionType";

import tryStringifyJSONObject from "./helpers/tryStringifyJSONObject";

import createBuffer from "./helpers/createBuffer";

import * as path from "path";
import appendToFile from "./helpers/appendToFile";
import formatDate from "./helpers/formatDate";

const LOGGER = (function () {
  let timeOutId: any = null;
  let rabbitMqConnection: rabbitMqConnectionType = null;
  let logsQueueName: string = "logs";
  let isLogOnly: boolean = false;
  let disableAll: boolean = false;
  let isDebugLogsEnabled: boolean = true;
  let isErrorLogsEnabled: boolean = true;
  let enableReconnect: boolean = true;
  let reconnectTimeout: number = 30000;
  let app_name: string = "N/A";
  let localLogsOptions: {
    enableLocalLogs: boolean;
    localLogsPath: string;
    enableLocalLogsDebug?: boolean;
    enableLocalLogsErrors?: boolean;
  } = null;

  let errorLogPath = null;
  let debugLogPath = null;

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
      localLogs: {
        enableLocalLogs: boolean;
        enableLocalLogsDebug?: boolean;
        enableLocalLogsErrors?: boolean;
        localLogsPath?: string;
      },
      appName = "N/A",
      callBacks?: {
        onErrorCallback?: (error: Error) => any;
        onDisconnectCallback?: Function;
        onConnectCallback?: Function;
      }
    ): Promise<rabbitMqConnectionType | undefined | any> {
      disableAll = extraOptions?.disableAll ?? false;
      isDebugLogsEnabled = extraOptions?.enableDebug ?? true;
      isErrorLogsEnabled = extraOptions?.enableError ?? true;
      enableReconnect = extraOptions?.enableReconnect ?? true;
      reconnectTimeout = extraOptions?.reconnectTimeout || 30000;
      isLogOnly = extraOptions?.logOnly ?? false;
      app_name = appName;
      logsQueueName = queueName;

      errorLogPath = path.join(
        localLogs?.localLogsPath || __dirname,
        "errors.log"
      );

      debugLogPath = path.join(
        localLogs?.localLogsPath || __dirname,
        "debug.log"
      );

      localLogsOptions = {
        enableLocalLogs: localLogs?.enableLocalLogs ?? false,
        enableLocalLogsDebug: localLogs?.enableLocalLogsDebug ?? false,
        enableLocalLogsErrors: localLogs?.enableLocalLogsErrors ?? false,
        localLogsPath: localLogs?.localLogsPath || __dirname,
      };

      try {
        if (timeOutId) {
          clearTimeout(timeOutId);
        }

        if (disableAll || isLogOnly) {
          return (rabbitMqConnection = null);
        }

        const conn = await amqp.connect(option);

        conn?.once("error", (error) => {
          disableAll = true;
          callBacks?.onErrorCallback && callBacks?.onErrorCallback(error);
          logsChannel?.close();

          rabbitMqConnection = {
            ...rabbitMqConnection,
            amqpConnection: null,
            channelConnection: null,
          };

          if (enableReconnect) {
            console.log(
              "=============== Retrying to reconnect to imxLogger in " +
                reconnectTimeout +
                "MS ...... ==============="
            );
            if (timeOutId) {
              clearTimeout(timeOutId);
            }
            timeOutId = setTimeout(async () => {
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
                  localLogsOptions,
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
          return;
        });

        conn?.on("blocked", (reason) => {
          disableAll = true;
          return;
        });

        conn?.on("unblocked", () => {
          disableAll = false;
          return;
        });

        conn?.on("disconnected", () => {
          if (timeOutId) {
            clearTimeout(timeOutId);
          }
          disableAll = true;
          try {
            logsChannel && logsChannel?.close();
            conn && conn?.close();
            rabbitMqConnection = {
              ...rabbitMqConnection,
              amqpConnection: null,
              channelConnection: null,
            };
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

          if (enableReconnect) {
            console.log(
              "=============== Retrying to reconnect to imxLogger in " +
                reconnectTimeout +
                "MS ...... ==============="
            );

            if (timeOutId) {
              clearTimeout(timeOutId);
            }
            timeOutId = setTimeout(async () => {
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
                  localLogsOptions,
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
          disableAll = true;
          return;
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
            if (
              localLogsOptions?.enableLocalLogs &&
              localLogsOptions?.enableLocalLogsErrors
            ) {
              const logContent = `[${formatDate(
                new Date()
              )}] [ERRORS] [${app_name}] [${payload?.context?.toString()}]  : ${tryStringifyJSONObject(
                payload
              )}`;
              appendToFile(errorLogPath, logContent);
            }

            if (!logsChannel) {
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
            if (
              localLogsOptions?.enableLocalLogs &&
              localLogsOptions?.enableLocalLogsDebug
            ) {
              const logContent = `[${formatDate(
                new Date()
              )}] [DEBuG] [${app_name}] [${payload?.context?.toString()}]  : ${tryStringifyJSONObject(
                payload
              )}`;
              appendToFile(debugLogPath, logContent);
            }

            if (!logsChannel) {
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

        if (enableReconnect) {
          console.log(
            "=============== Retrying to reconnect to imxLogger in " +
              reconnectTimeout +
              "MS ...... ==============="
          );

          if (timeOutId) {
            clearTimeout(timeOutId);
          }
          timeOutId = setTimeout(async () => {
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
                localLogsOptions,
                app_name,
                {
                  ...callBacks,
                }
              );
            } catch (error) {
              return;
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

    getLocalLoggingOption() {
      return localLogsOptions;
    },

    enableLocalLogging() {
      localLogsOptions.enableLocalLogs = true;
    },

    disableLocalLogging() {
      localLogsOptions.enableLocalLogs = false;
    },

    disableDebugLoggingInLocal() {
      localLogsOptions.enableLocalLogsDebug = false;
    },

    enableDebugLoggingInLocal() {
      localLogsOptions.enableLocalLogsDebug = true;
    },

    disableErrorLoggingInLocal() {
      localLogsOptions.enableLocalLogsErrors = false;
    },

    enableErrorLoggingInLocal() {
      localLogsOptions.enableLocalLogsErrors = true;
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
      if (
        localLogsOptions?.enableLocalLogs &&
        localLogsOptions?.enableLocalLogsErrors
      ) {
        const logContent = `[${formatDate(
          new Date()
        )}] [ERRORS] [${app_name}] [${payload?.context?.toString()}]  : ${tryStringifyJSONObject(
          payload
        )}`;
        appendToFile(errorLogPath, logContent);
      }

      if (disableAll || !isErrorLogsEnabled) return;
      if (isLogOnly) {
        console.error(payload);
      }

      if (
        !rabbitMqConnection?.amqpConnection ||
        !rabbitMqConnection?.channelConnection ||
        !rabbitMqConnection
      ) {
        return;
      }

      rabbitMqConnection?.error(payload);
    },

    debug(payload: messagePayloadASArg) {
      if (
        localLogsOptions?.enableLocalLogs &&
        localLogsOptions?.enableLocalLogsDebug
      ) {
        const logContent = `[${formatDate(
          new Date()
        )}] [DEBuG] [${app_name}] [${payload?.context?.toString()}]  : ${tryStringifyJSONObject(
          payload
        )}`;
        appendToFile(debugLogPath, logContent);
      }

      if (disableAll || !isDebugLogsEnabled) return;
      if (isLogOnly) {
        console.log(payload);
      }

      if (
        !rabbitMqConnection?.amqpConnection ||
        !rabbitMqConnection?.channelConnection ||
        !rabbitMqConnection
      ) {
        return;
      }

      rabbitMqConnection?.debug(payload);
    },

    disconnectFromLogger() {
      if (
        !rabbitMqConnection?.amqpConnection ||
        !rabbitMqConnection?.channelConnection ||
        !rabbitMqConnection
      ) {
        return;
      }
      try {
        rabbitMqConnection?.amqpConnection?.emit("disconnected");
      } catch (error) {
        return;
      }
    },
  };
})();

export default LOGGER;
