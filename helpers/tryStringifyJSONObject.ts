import { messagePayloadType } from "../Types/messagePayloadType";

function tryStringifyJSONObject(object: object) {
  try {
    if (object && typeof object !== "object") {
      const payload: messagePayloadType = {
        payload: {
          appName: "IMXLOGGER_NODE",
          context: "ERROR_STRINGIFY",
          message:
            "Erreur in IMX LOGGER FOR NODE,  payload message while sending logs : input ====>  ",
          extra: object,
          level: "debug",
          date: new Date(),
        },
      };
      const stringedValue = JSON.stringify(payload);
      return stringedValue;
    }
    const stringedValue = JSON.stringify(object);
    return stringedValue;
  } catch (e) {
    const payload: messagePayloadType = {
      payload: {
        appName: "IMXLOGGER_NODE",
        context: "ERROR_STRINGIFY",
        message:
          "Erreur in IMX LOGGER FOR NODE,  payload message while sending logs : input ====>  ",
        extra: object,
        level: "errors",
        date: new Date(),
      },
    };
    const stringedValue = JSON.stringify(payload);
    return stringedValue;
  }
}

export default tryStringifyJSONObject;
