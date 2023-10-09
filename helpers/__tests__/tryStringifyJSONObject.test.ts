import { messagePayloadType } from "../../Types/messagePayloadType";
import tryStringifyJSONObject from "../tryStringifyJSONObject";

describe("tryStringifyJSONObject function", () => {
  it("should stringify a valid object", () => {
    const inputObject = { key: "value" };
    const result = tryStringifyJSONObject(inputObject);
    expect(result).toEqual(JSON.stringify(inputObject));
  });

  it("should handle non-object input", () => {
    const inputNonObject = "not an object";
    const expectedPayload: messagePayloadType = {
      payload: {
        appName: "IMXLOGGER_NODE",
        context: "ERROR_STRINGIFY",
        message:
          "Erreur in IMX LOGGER FOR NODE,  payload message while sending logs : input ====>  ",
        extra: inputNonObject,
        level: "debug",
        date: expect.any(Date),
      },
    };
    const result = tryStringifyJSONObject(inputNonObject as any);
    expect(result).toEqual(JSON.stringify(expectedPayload));
  });

  it("should handle error while stringifying", () => {
    const inputObject = { circularReference: null };
    inputObject.circularReference = inputObject;
    const expectedPayload: messagePayloadType = {
      payload: {
        appName: "IMXLOGGER_NODE",
        context: "ERROR_STRINGIFY",
        message:
          "Erreur in IMX LOGGER FOR NODE,  payload message while sending logs : input ====>  ",
        extra: inputObject,
        level: "errors",
        date: expect.any(Date),
      },
    };
    const result = tryStringifyJSONObject(inputObject);
    expect(result).toEqual(JSON.stringify(expectedPayload));
  });
});
