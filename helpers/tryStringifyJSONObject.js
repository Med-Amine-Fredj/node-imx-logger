"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function tryStringifyJSONObject(object) {
    try {
        if (object && typeof object !== "object") {
            var payload = {
                payload: {
                    appName: "IMXLOGGER_NODE",
                    context: "ERROR_STRINGIFY",
                    message: "Erreur in IMX LOGGER FOR NODE,  payload message while sending logs : input ====>  ",
                    extra: object,
                    level: "debug",
                    date: new Date(),
                },
            };
            var stringedValue_1 = JSON.stringify(payload);
            return stringedValue_1;
        }
        var stringedValue = JSON.stringify(object);
        return stringedValue;
    }
    catch (e) {
        var payload = {
            payload: {
                appName: "IMXLOGGER_NODE",
                context: "ERROR_STRINGIFY",
                message: "Erreur in IMX LOGGER FOR NODE,  payload message while sending logs : input ====>  ",
                extra: object,
                level: "errors",
                date: new Date(),
            },
        };
        var stringedValue = JSON.stringify(payload);
        return stringedValue;
    }
}
exports.default = tryStringifyJSONObject;
