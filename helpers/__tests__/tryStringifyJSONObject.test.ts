import tryStringifyJSONObject from "../tryStringifyJSONObject"; // Update the path accordingly

describe("tryStringifyJSONObject", () => {
  // Positive Test Cases
  it("should stringify a valid object and return a JSON string", () => {
    const validObject = {
      key: "value",
      nested: {
        innerKey: "innerValue",
      },
    };
    const result = tryStringifyJSONObject(validObject);
    expect(typeof result).toBe("string");
    expect(() => JSON.parse(result)).not.toThrow(SyntaxError);
  });

  // Negative Test Cases
  it("should handle invalid input gracefully and return an error payload", () => {
    const invalidInput = "invalid input"; // Invalid input, not an object
    const result = tryStringifyJSONObject(invalidInput as any);

    // Ensure the result is a JSON string representing an error payload
    expect(typeof result).toBe("string");
    expect(() => JSON.parse(result)).not.toThrow(SyntaxError);

    // Check if the result contains expected error properties
    const errorPayload = JSON.parse(result);
    expect(errorPayload.payload.appName).toEqual("IMXLOGGER_NODE");
    expect(errorPayload.payload.context).toEqual("ERROR_STRINGIFY");
    expect(errorPayload.payload.level).toEqual("errors");
    expect(errorPayload.payload.extra).toEqual(invalidInput);
  });

  it("should handle thrown errors and return an error payload", () => {
    const invalidObject = "string"; // Invalid object, not an object
    const result = tryStringifyJSONObject(invalidObject as any);

    // Ensure the result is a JSON string representing an error payload
    expect(typeof result).toBe("string");
    expect(() => JSON.parse(result)).not.toThrow(SyntaxError);

    // Check if the result contains expected error properties
    const errorPayload = JSON.parse(result);
    expect(errorPayload.payload.appName).toEqual("IMXLOGGER_NODE");
    expect(errorPayload.payload.context).toEqual("ERROR_STRINGIFY");
    expect(errorPayload.payload.level).toEqual("errors");
    expect(errorPayload.payload.extra).toEqual(invalidObject);
  });

  it("should handle circular references and return an error payload", () => {
    const circularObject: any = {};
    circularObject.circularReference = circularObject;

    const result = tryStringifyJSONObject(circularObject);

    // Ensure the result is a JSON string representing an error payload
    expect(typeof result).toBe("string");
    expect(() => JSON.parse(result)).not.toThrow(SyntaxError);

    // Check if the result contains expected error properties
    const errorPayload = JSON.parse(result);

    expect(errorPayload.payload.appName).toEqual("IMXLOGGER_NODE");
    expect(errorPayload.payload.context).toEqual("ERROR_STRINGIFY");
    expect(errorPayload.payload.level).toEqual("errors");

    // Check if the extra property contains "[Circular Reference]"
    expect(errorPayload.payload.extra.circularReference).toEqual(undefined);
  });
});
