"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function tryStringifyJSONObject(object) {
    try {
        if (object && typeof object !== "object") {
            console.error("Erreur in payload message while sending logs : input ====>  ", object);
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
        console.error("Erreur in payload message while sending logs : input ====>  ", object);
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
        var stringedValue = JSON.stringify(payload);
        return stringedValue;
    }
}
exports.default = tryStringifyJSONObject;
