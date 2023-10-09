"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var tryStringifyJSONObject_1 = require("./tryStringifyJSONObject");
function createBuffer(arg) {
    try {
        if (!arg && !Array.isArray(arg) && !Buffer.isBuffer(arg)) {
            throw new Error("Argument must be an array, string, or Buffer type");
        }
        return Buffer.from(arg);
    }
    catch (error) {
        console.warn("Error creating buffer when sending logs : ", error === null || error === void 0 ? void 0 : error.message);
        var errorPayload = {
            message: "Error in create Buffer from imxNodeLogger package ",
            context: "PACKAGE",
            user: "node-imx-logger",
            extra: {},
        };
        var emittedErrorPayload = (0, tryStringifyJSONObject_1.default)({
            payload: __assign(__assign({}, errorPayload), { level: "errors", date: new Date(), appName: "node-imx-logger" }),
        });
        return Buffer.from(emittedErrorPayload);
    }
}
exports.default = createBuffer;
