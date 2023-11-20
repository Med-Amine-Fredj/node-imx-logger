import { messagePayloadType } from "../Types/messagePayloadType";

function tryStringifyJSONObject(object: object) {
  try {
    if (object && typeof object !== "object") {
      throw new Error("Arg must be a string");
    }

    const stringedValue = JSON.stringify(object);
    return stringedValue;
  } catch (e) {
    const payload: messagePayloadType = {
      payload: {
        appName: "imx-node-logger",
        context: "ERROR_STRINGIFY",
        message:
          "Erreur in IMX LOGGER FOR NODE,  payload message while sending logs : input ====>  ",
        extra: object,
        level: "errors",
        date: new Date(),
      },
    };

    let cache: any = [];

    let str = JSON.stringify(payload, function (key, value) {
      if (typeof value === "object" && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Circular reference found, discard key

          return;
        }
        // Store value in our collection
        cache.push(value);
      }
      return value;
    });
    cache = null;

    return str;
  }
}

export default tryStringifyJSONObject;
