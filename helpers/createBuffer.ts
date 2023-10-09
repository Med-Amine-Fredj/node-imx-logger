import tryStringifyJSONObject from "./tryStringifyJSONObject";

function createBuffer(arg: any) {
  try {
    if (!arg && !Array.isArray(arg) && !Buffer.isBuffer(arg)) {
      throw new Error("Argument must be an array, string, or Buffer type");
    }

    return Buffer.from(arg);
  } catch (error) {
    console.warn("Error creating buffer when sending logs : ", error?.message);

    const errorPayload = {
      message: "Error in create Buffer from imxNodeLogger package ",
      context: "PACKAGE",
      user: "node-imx-logger",
      extra: {},
    };

    const emittedErrorPayload = tryStringifyJSONObject({
      payload: {
        ...errorPayload,
        level: "errors",
        date: new Date(),
        appName: "node-imx-logger",
      },
    });

    return Buffer.from(emittedErrorPayload);
  }
}

export default createBuffer;
