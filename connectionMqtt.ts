import * as amqp from "amqplib";

import { connectOptionsType } from "./Types/connectionOption";
import { messagePayloadToMqTTFromUsers } from "./Types/messagePayloadType";
import { rabbitMqConnectionType } from "./Types/rabbitMqConnectionType";

const LOGGER = (function () {
  let rabbitMqConnection: rabbitMqConnectionType = null;

  let isEnabled: boolean = true;

  let logsChannelName: string = "";

  return {
    async createConnectionToRabbitMQ(
      option: connectOptionsType,
      queueName: string,
      enable?: boolean
    ): Promise<rabbitMqConnectionType> {
      try {
        isEnabled = enable ?? true;

        const conn = await amqp.connect(option);

        conn.on("error", (error) => {
          console.error(
            "Erreur in createConnectionToRabbitMQ : ",
            error?.messgae
          );
          console.log(
            "=============== Retrying to reconnect to imxLogger in 30 sec ...... ==============="
          );
          setTimeout(async () => {
            console.log(
              "=============== Trying to reconnect to imxLogger.... ==============="
            );
            await LOGGER.createConnectionToRabbitMQ(option, queueName, enable);
          }, 30000);
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
          isEnabled,
          enableLogging() {
            isEnabled = true;
          },
          disableLogging() {
            isEnabled = false;
          },
          checkIsEnaled() {
            return isEnabled;
          },
          error(payload: messagePayloadToMqTTFromUsers) {
            if (!isEnabled) return;
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
            if (!isEnabled) return;
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

    enableLogging() {
      isEnabled = true;
    },

    checkIsEnaled() {
      return isEnabled;
    },

    disableLogging() {
      isEnabled = false;
    },

    error(payload: messagePayloadToMqTTFromUsers) {
      if (!isEnabled) return;
      rabbitMqConnection?.error(payload);
    },

    debug(payload: messagePayloadToMqTTFromUsers) {
      if (!isEnabled) return;
      rabbitMqConnection?.debug(payload);
    },
  };
})();

export default LOGGER;
