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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var amqp = require("amqplib");
var tryStringifyJSONObject_1 = require("./helpers/tryStringifyJSONObject");
var LOGGER = (function () {
    var rabbitMqConnection = null;
    var isDebugLogsEnabled = true;
    var isErrorLogsEnabled = true;
    var enableReconnect = true;
    var reconnectTimeout = 30000;
    var logsChannelName = "";
    var app_name = "N/A";
    return {
        createConnectionToRabbitMQ: function (option, queueName, extraOptions, appName, callBacks) {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function () {
                var conn, logsChannel_1, error_1;
                var _this = this;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 4, , 5]);
                            isDebugLogsEnabled = (_a = extraOptions === null || extraOptions === void 0 ? void 0 : extraOptions.enableDebug) !== null && _a !== void 0 ? _a : true;
                            isErrorLogsEnabled = (_b = extraOptions === null || extraOptions === void 0 ? void 0 : extraOptions.enableError) !== null && _b !== void 0 ? _b : true;
                            enableReconnect = (_c = extraOptions === null || extraOptions === void 0 ? void 0 : extraOptions.enableReconnect) !== null && _c !== void 0 ? _c : true;
                            reconnectTimeout = (extraOptions === null || extraOptions === void 0 ? void 0 : extraOptions.reconnectTimeout) || 30000;
                            app_name = appName || "N/A";
                            logsChannelName = queueName || "logs";
                            return [4 /*yield*/, amqp.connect(option)];
                        case 1:
                            conn = _d.sent();
                            conn.on("error", function (error) {
                                (callBacks === null || callBacks === void 0 ? void 0 : callBacks.onErrorCallback) && (callBacks === null || callBacks === void 0 ? void 0 : callBacks.onErrorCallback());
                                console.error("Erreur in createConnectionToRabbitMQ : ", error === null || error === void 0 ? void 0 : error.messgae);
                                if (enableReconnect) {
                                    console.log("=============== Retrying to reconnect to imxLogger in " +
                                        reconnectTimeout +
                                        "MS ...... ===============");
                                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    console.log("=============== Trying to reconnect to imxLogger.... ===============");
                                                    return [4 /*yield*/, LOGGER.createConnectionToRabbitMQ(option, queueName, {
                                                            enableDebug: extraOptions === null || extraOptions === void 0 ? void 0 : extraOptions.enableDebug,
                                                            enableError: extraOptions === null || extraOptions === void 0 ? void 0 : extraOptions.enableError,
                                                            enableReconnect: extraOptions === null || extraOptions === void 0 ? void 0 : extraOptions.enableReconnect,
                                                            reconnectTimeout: extraOptions === null || extraOptions === void 0 ? void 0 : extraOptions.reconnectTimeout,
                                                        }, app_name, {
                                                            onConnectCallback: callBacks === null || callBacks === void 0 ? void 0 : callBacks.onConnectCallback,
                                                            onDisconnectCallback: callBacks === null || callBacks === void 0 ? void 0 : callBacks.onDisconnectCallback,
                                                            onErrorCallback: callBacks === null || callBacks === void 0 ? void 0 : callBacks.onErrorCallback,
                                                        })];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }, reconnectTimeout);
                                }
                            });
                            conn.on("disconnected", function () {
                                console.log("=============== imxNodeLogger disconnected =============== ");
                                (callBacks === null || callBacks === void 0 ? void 0 : callBacks.onDisconnectCallback) && (callBacks === null || callBacks === void 0 ? void 0 : callBacks.onDisconnectCallback());
                            });
                            conn.on("connected", function () {
                                (callBacks === null || callBacks === void 0 ? void 0 : callBacks.onConnectCallback) && (callBacks === null || callBacks === void 0 ? void 0 : callBacks.onConnectCallback());
                                console.log("=============== imxNodeLogger connected ===============");
                            });
                            return [4 /*yield*/, conn.createChannel()];
                        case 2:
                            logsChannel_1 = _d.sent();
                            return [4 /*yield*/, logsChannel_1.checkQueue(logsChannelName)];
                        case 3:
                            _d.sent();
                            console.log("==================== Connected to imx Logger successfully  =======================");
                            rabbitMqConnection = {
                                amqpConnection: conn,
                                channelConnection: logsChannel_1,
                                errorLoggingStatus: isErrorLogsEnabled,
                                debugLoggingStatus: isDebugLogsEnabled,
                                enableErrorLogging: function () {
                                    isErrorLogsEnabled = true;
                                },
                                disableErrorLogging: function () {
                                    isErrorLogsEnabled = false;
                                },
                                enableDebugLogging: function () {
                                    isDebugLogsEnabled = true;
                                },
                                disableDebugLogging: function () {
                                    isDebugLogsEnabled = false;
                                },
                                checkLoggingStatus: function () {
                                    return {
                                        errorLoggingStatus: isErrorLogsEnabled,
                                        debugLoggingStatus: isDebugLogsEnabled,
                                    };
                                },
                                checkErrorLoggingStatus: function () {
                                    return isErrorLogsEnabled;
                                },
                                checkDebugLoggingStatus: function () {
                                    return isDebugLogsEnabled;
                                },
                                setAppName: function (appName) {
                                    app_name = appName;
                                },
                                error: function (payload) {
                                    if (!isErrorLogsEnabled)
                                        return;
                                    logsChannel_1.sendToQueue(logsChannelName, Buffer.from((0, tryStringifyJSONObject_1.default)({
                                        payload: __assign(__assign({}, payload), { level: "errors", date: new Date(), appName: app_name }),
                                    })));
                                },
                                debug: function (payload) {
                                    if (!isDebugLogsEnabled)
                                        return;
                                    logsChannel_1.sendToQueue(logsChannelName, Buffer.from((0, tryStringifyJSONObject_1.default)({
                                        payload: __assign(__assign({}, payload), { level: "debug", date: new Date(), appName: app_name }),
                                    })));
                                },
                            };
                            return [2 /*return*/, rabbitMqConnection];
                        case 4:
                            error_1 = _d.sent();
                            console.error("Erreur in createConnectionToRabbitMQ : ", error_1);
                            return [2 /*return*/, error_1];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
        getConnectionObject: function () {
            return rabbitMqConnection;
        },
        enableErrorLogging: function () {
            isErrorLogsEnabled = true;
        },
        disableErrorLogging: function () {
            isErrorLogsEnabled = false;
        },
        enableDebugLogging: function () {
            isDebugLogsEnabled = true;
        },
        disableDebugLogging: function () {
            isDebugLogsEnabled = false;
        },
        checkLoggingStatus: function () {
            return {
                errorLoggingStatus: isErrorLogsEnabled,
                debugLoggingStatus: isDebugLogsEnabled,
            };
        },
        checkErrorLoggingStatus: function () {
            return isErrorLogsEnabled;
        },
        checkDebugLoggingStatus: function () {
            return isDebugLogsEnabled;
        },
        setAppName: function (appName) {
            rabbitMqConnection === null || rabbitMqConnection === void 0 ? void 0 : rabbitMqConnection.setAppName(appName);
        },
        error: function (payload) {
            if (!isErrorLogsEnabled)
                return;
            rabbitMqConnection === null || rabbitMqConnection === void 0 ? void 0 : rabbitMqConnection.error(payload);
        },
        debug: function (payload) {
            if (!isDebugLogsEnabled)
                return;
            rabbitMqConnection === null || rabbitMqConnection === void 0 ? void 0 : rabbitMqConnection.debug(payload);
        },
    };
})();
exports.default = LOGGER;
