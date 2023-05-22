import { ChannelType } from "./Types/channelType";
import { connectOptionsType } from "./Types/connectionOption";
import { createCoonectionResult } from "./Types/createConnectionResult";
import { messagePayloadToMqTTFromUsers } from "./Types/messagePayloadType";

import * as amqp from "amqplib";

const LOGGER = (function () {
  let mqttConnection: any | null = null;

  return {
    async createMqttConnection(option: connectOptionsType): Promise<
      createCoonectionResult & {
        logs: ChannelType;
        error: (payload: messagePayloadToMqTTFromUsers) => void;
        debug: (payload: messagePayloadToMqTTFromUsers) => void;
      }
    > {
      try {
        const conn = await amqp.connect(option);

        const logsChannelName = "logs";
        const logsChannel = await conn.createChannel();

        await logsChannel.assertQueue(logsChannelName, { durable: true });

        mqttConnection = {
          ...conn,
          [logsChannelName]: logsChannel,
          error: (payload: messagePayloadToMqTTFromUsers) =>
            logsChannel.sendToQueue(
              "logs",
              Buffer.from(
                JSON.stringify({
                  payload: { ...payload, level: "errors", date: new Date() },
                })
              )
            ),
          debug: (payload: messagePayloadToMqTTFromUsers) =>
            logsChannel.sendToQueue(
              "logs",
              Buffer.from(
                JSON.stringify({
                  payload: { ...payload, level: "debug", date: new Date() },
                })
              )
            ),
        };

        return mqttConnection;
      } catch (error) {
        console.error("Erreur in createMqttConnection :  ", error);
        return error;
      }
    },

    getMqttConnection() {
      return mqttConnection;
    },

    error(payload: messagePayloadToMqTTFromUsers) {
      mqttConnection["logs"].assertQueue("logs", {
        durable: true,
      });

      mqttConnection["logs"].sendToQueue(
        "logs",
        Buffer.from(
          JSON.stringify({
            payload: { ...payload, level: "errors", date: new Date() },
          })
        )
      );
    },

    debug(payload: messagePayloadToMqTTFromUsers) {
      if (!mqttConnection) {
        console.warn(
          "Make sure you created the MQTT connection successfully !"
        );
        return;
      }
      mqttConnection["logs"].assertQueue("logs", {
        durable: true,
      });

      mqttConnection["logs"].sendToQueue(
        "logs",
        Buffer.from(
          JSON.stringify({
            payload: { ...payload, level: "debug", date: new Date() },
          })
        )
      );
    },
  };
})();

export default LOGGER;
