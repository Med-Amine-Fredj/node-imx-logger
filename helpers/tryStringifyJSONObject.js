"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function tryStringifyJSONObject(object) {
    try {
        if (object && typeof object !== "object") {
            throw new Error("Arg must be a string");
        }
        var stringedValue = JSON.stringify(object);
        return stringedValue;
    }
    catch (e) {
        var payload = {
            payload: {
                appName: "imx-node-logger",
                context: "ERROR_STRINGIFY",
                message: "Erreur in IMX LOGGER FOR NODE,  payload message while sending logs : input ====>  ",
                extra: object,
                level: "errors",
                date: new Date(),
            },
        };
        var cache_1 = [];
        var str = JSON.stringify(payload, function (key, value) {
            if (typeof value === "object" && value !== null) {
                if (cache_1.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache_1.push(value);
            }
            return value;
        });
        cache_1 = null;
        return str;
    }
}
exports.default = tryStringifyJSONObject;
