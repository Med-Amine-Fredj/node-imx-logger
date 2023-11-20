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
var createBuffer_1 = require("./helpers/createBuffer");
var LOGGER = (function () {
    var timeOutId = null;
    var rabbitMqConnection = null;
    var logsQueueName = "logs";
    var isLogOnly = false;
    var disableAll = false;
    var isDebugLogsEnabled = true;
    var isErrorLogsEnabled = true;
    var enableReconnect = true;
    var reconnectTimeout = 30000;
    var app_name = "N/A";
    return {
        createConnectionToRabbitMQ: function (option, queueName, extraOptions, appName, callBacks) {
            var _a, _b, _c, _d, _e;
            if (appName === void 0) { appName = "N/A"; }
            return __awaiter(this, void 0, void 0, function () {
                var conn_1, logsChannel_1, error_1;
                var _this = this;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            disableAll = (_a = extraOptions === null || extraOptions === void 0 ? void 0 : extraOptions.disableAll) !== null && _a !== void 0 ? _a : false;
                            isDebugLogsEnabled = (_b = extraOptions === null || extraOptions === void 0 ? void 0 : extraOptions.enableDebug) !== null && _b !== void 0 ? _b : true;
                            isErrorLogsEnabled = (_c = extraOptions === null || extraOptions === void 0 ? void 0 : extraOptions.enableError) !== null && _c !== void 0 ? _c : true;
                            enableReconnect = (_d = extraOptions === null || extraOptions === void 0 ? void 0 : extraOptions.enableReconnect) !== null && _d !== void 0 ? _d : true;
                            reconnectTimeout = (extraOptions === null || extraOptions === void 0 ? void 0 : extraOptions.reconnectTimeout) || 30000;
                            isLogOnly = (_e = extraOptions === null || extraOptions === void 0 ? void 0 : extraOptions.logOnly) !== null && _e !== void 0 ? _e : false;
                            app_name = appName;
                            logsQueueName = queueName;
                            _f.label = 1;
                        case 1:
                            _f.trys.push([1, 5, , 6]);
                            if (timeOutId) {
                                clearTimeout(timeOutId);
                            }
                            if (disableAll || isLogOnly) {
                                return [2 /*return*/, (rabbitMqConnection = null)];
                            }
                            return [4 /*yield*/, amqp.connect(option)];
                        case 2:
                            conn_1 = _f.sent();
                            conn_1 === null || conn_1 === void 0 ? void 0 : conn_1.once("error", function (error) {
                                disableAll = true;
                                (callBacks === null || callBacks === void 0 ? void 0 : callBacks.onErrorCallback) && (callBacks === null || callBacks === void 0 ? void 0 : callBacks.onErrorCallback(error));
                                logsChannel_1 === null || logsChannel_1 === void 0 ? void 0 : logsChannel_1.close();
                                rabbitMqConnection = __assign(__assign({}, rabbitMqConnection), { amqpConnection: null, channelConnection: null });
                                if (enableReconnect) {
                                    console.log("=============== Retrying to reconnect to imxLogger in " +
                                        reconnectTimeout +
                                        "MS ...... ===============");
                                    if (timeOutId) {
                                        clearTimeout(timeOutId);
                                    }
                                    timeOutId = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                        var error_2;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    console.log("=============== Trying to reconnect to imxLogger.... ===============");
                                                    _a.label = 1;
                                                case 1:
                                                    _a.trys.push([1, 3, , 4]);
                                                    return [4 /*yield*/, LOGGER.createConnectionToRabbitMQ(option, queueName, __assign({}, extraOptions), app_name, {
                                                            onConnectCallback: callBacks === null || callBacks === void 0 ? void 0 : callBacks.onConnectCallback,
                                                            onDisconnectCallback: callBacks === null || callBacks === void 0 ? void 0 : callBacks.onDisconnectCallback,
                                                            onErrorCallback: callBacks === null || callBacks === void 0 ? void 0 : callBacks.onErrorCallback,
                                                        })];
                                                case 2:
                                                    _a.sent();
                                                    return [3 /*break*/, 4];
                                                case 3:
                                                    error_2 = _a.sent();
                                                    throw new Error("Error in reconnect from connection error event : " +
                                                        (error_2 === null || error_2 === void 0 ? void 0 : error_2.message));
                                                case 4: return [2 /*return*/];
                                            }
                                        });
                                    }); }, reconnectTimeout);
                                }
                            });
                            conn_1 === null || conn_1 === void 0 ? void 0 : conn_1.on("close", function () {
                                return;
                            });
                            conn_1 === null || conn_1 === void 0 ? void 0 : conn_1.on("blocked", function (reason) {
                                disableAll = true;
                                return;
                            });
                            conn_1 === null || conn_1 === void 0 ? void 0 : conn_1.on("unblocked", function () {
                                disableAll = false;
                                return;
                            });
                            conn_1 === null || conn_1 === void 0 ? void 0 : conn_1.on("disconnected", function () {
                                if (timeOutId) {
                                    clearTimeout(timeOutId);
                                }
                                disableAll = true;
                                try {
                                    logsChannel_1 && (logsChannel_1 === null || logsChannel_1 === void 0 ? void 0 : logsChannel_1.close());
                                    conn_1 && (conn_1 === null || conn_1 === void 0 ? void 0 : conn_1.close());
                                    rabbitMqConnection = __assign(__assign({}, rabbitMqConnection), { amqpConnection: null, channelConnection: null });
                                    (callBacks === null || callBacks === void 0 ? void 0 : callBacks.onDisconnectCallback) &&
                                        (callBacks === null || callBacks === void 0 ? void 0 : callBacks.onDisconnectCallback());
                                    console.log("=============== imxNodeLogger disconnected =============== ");
                                }
                                catch (error) {
                                    throw new Error("Error in disconnect event : " + (error === null || error === void 0 ? void 0 : error.message));
                                }
                            });
                            conn_1 === null || conn_1 === void 0 ? void 0 : conn_1.on("connected", function () {
                                (callBacks === null || callBacks === void 0 ? void 0 : callBacks.onConnectCallback) && (callBacks === null || callBacks === void 0 ? void 0 : callBacks.onConnectCallback());
                                console.log("==================== Connected to imx Logger successfully  =======================");
                            });
                            return [4 /*yield*/, (conn_1 === null || conn_1 === void 0 ? void 0 : conn_1.createChannel())];
                        case 3:
                            logsChannel_1 = _f.sent();
                            return [4 /*yield*/, (logsChannel_1 === null || logsChannel_1 === void 0 ? void 0 : logsChannel_1.checkQueue(logsQueueName))];
                        case 4:
                            _f.sent();
                            logsChannel_1.once("error", function (error) {
                                disableAll = true;
                                if (conn_1) {
                                    logsChannel_1 === null || logsChannel_1 === void 0 ? void 0 : logsChannel_1.close();
                                    conn_1 === null || conn_1 === void 0 ? void 0 : conn_1.emit("error", error);
                                    return;
                                }
                                if (enableReconnect) {
                                    console.log("=============== Retrying to reconnect to imxLogger in " +
                                        reconnectTimeout +
                                        "MS ...... ===============");
                                    if (timeOutId) {
                                        clearTimeout(timeOutId);
                                    }
                                    timeOutId = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                        var error_3;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    console.log("=============== Trying to reconnect to imxLogger.... ===============");
                                                    _a.label = 1;
                                                case 1:
                                                    _a.trys.push([1, 3, , 4]);
                                                    return [4 /*yield*/, LOGGER.createConnectionToRabbitMQ(option, queueName, __assign({}, extraOptions), app_name, {
                                                            onConnectCallback: callBacks === null || callBacks === void 0 ? void 0 : callBacks.onConnectCallback,
                                                            onDisconnectCallback: callBacks === null || callBacks === void 0 ? void 0 : callBacks.onDisconnectCallback,
                                                            onErrorCallback: callBacks === null || callBacks === void 0 ? void 0 : callBacks.onErrorCallback,
                                                        })];
                                                case 2:
                                                    _a.sent();
                                                    return [3 /*break*/, 4];
                                                case 3:
                                                    error_3 = _a.sent();
                                                    throw new Error("Error createConnectionToRabbitMQ reconnect in logChannel error event : " +
                                                        (error_3 === null || error_3 === void 0 ? void 0 : error_3.message));
                                                case 4: return [2 /*return*/];
                                            }
                                        });
                                    }); }, reconnectTimeout);
                                }
                            });
                            logsChannel_1.on("close", function () {
                                disableAll = true;
                                return;
                            });
                            logsChannel_1.on("return", function (msg) {
                                return;
                            });
                            logsChannel_1.on("drain", function () {
                                return;
                            });
                            rabbitMqConnection = {
                                amqpConnection: conn_1,
                                channelConnection: logsChannel_1,
                                error: function (payload) {
                                    if (!logsChannel_1) {
                                        return;
                                    }
                                    try {
                                        logsChannel_1 === null || logsChannel_1 === void 0 ? void 0 : logsChannel_1.sendToQueue(logsQueueName, (0, createBuffer_1.default)((0, tryStringifyJSONObject_1.default)({
                                            payload: __assign(__assign({}, payload), { level: "errors", date: new Date(), appName: app_name }),
                                        })));
                                    }
                                    catch (error) {
                                        if (disableAll || !isErrorLogsEnabled)
                                            return;
                                        console.error(__assign(__assign({}, payload), { level: "errors", date: new Date(), appName: app_name }));
                                    }
                                },
                                debug: function (payload) {
                                    if (!logsChannel_1) {
                                        return;
                                    }
                                    try {
                                        logsChannel_1 === null || logsChannel_1 === void 0 ? void 0 : logsChannel_1.sendToQueue(logsQueueName, (0, createBuffer_1.default)((0, tryStringifyJSONObject_1.default)({
                                            payload: __assign(__assign({}, payload), { level: "debug", date: new Date(), appName: app_name }),
                                        })));
                                    }
                                    catch (error) {
                                        if (disableAll || !isDebugLogsEnabled)
                                            return;
                                        console.log(__assign(__assign({}, payload), { level: "debug", date: new Date(), appName: app_name }));
                                    }
                                },
                            };
                            conn_1 === null || conn_1 === void 0 ? void 0 : conn_1.emit("connected");
                            return [2 /*return*/, rabbitMqConnection];
                        case 5:
                            error_1 = _f.sent();
                            disableAll = true;
                            if (enableReconnect) {
                                console.log("=============== Retrying to reconnect to imxLogger in " +
                                    reconnectTimeout +
                                    "MS ...... ===============");
                                if (timeOutId) {
                                    clearTimeout(timeOutId);
                                }
                                timeOutId = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                    var error_4;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                console.log("=============== Trying to reconnect to imxLogger.... ===============");
                                                _a.label = 1;
                                            case 1:
                                                _a.trys.push([1, 3, , 4]);
                                                return [4 /*yield*/, LOGGER.createConnectionToRabbitMQ(option, queueName, __assign({}, extraOptions), app_name, __assign({}, callBacks))];
                                            case 2:
                                                _a.sent();
                                                return [3 /*break*/, 4];
                                            case 3:
                                                error_4 = _a.sent();
                                                return [2 /*return*/];
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                }); }, reconnectTimeout);
                            }
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        },
        getConnectionObject: function () {
            return rabbitMqConnection;
        },
        getAllExtraOptions: function () {
            return {
                enableDebug: isDebugLogsEnabled,
                enableError: isErrorLogsEnabled,
                enableReconnect: enableReconnect,
                reconnectTimeout: reconnectTimeout,
                logOnly: isLogOnly,
                disableAll: disableAll,
            };
        },
        enableDisableAllLogging: function () {
            disableAll = true;
        },
        disbaleDisableAllLogging: function () {
            disableAll = false;
        },
        checkDisableAllLoggingStatus: function () {
            return disableAll;
        },
        enableLogOngly: function () {
            isLogOnly = true;
        },
        disableLogOngly: function () {
            isLogOnly = false;
        },
        checkLogOnglyStatus: function () {
            return isLogOnly;
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
            app_name = appName;
        },
        error: function (payload) {
            if (disableAll || !isErrorLogsEnabled)
                return;
            if (isLogOnly) {
                console.error(payload);
            }
            if (!(rabbitMqConnection === null || rabbitMqConnection === void 0 ? void 0 : rabbitMqConnection.amqpConnection) ||
                !(rabbitMqConnection === null || rabbitMqConnection === void 0 ? void 0 : rabbitMqConnection.channelConnection) ||
                !rabbitMqConnection) {
                return;
            }
            rabbitMqConnection === null || rabbitMqConnection === void 0 ? void 0 : rabbitMqConnection.error(payload);
        },
        debug: function (payload) {
            if (disableAll || !isDebugLogsEnabled)
                return;
            if (isLogOnly) {
                console.log(payload);
            }
            if (!(rabbitMqConnection === null || rabbitMqConnection === void 0 ? void 0 : rabbitMqConnection.amqpConnection) ||
                !(rabbitMqConnection === null || rabbitMqConnection === void 0 ? void 0 : rabbitMqConnection.channelConnection) ||
                !rabbitMqConnection) {
                return;
            }
            rabbitMqConnection === null || rabbitMqConnection === void 0 ? void 0 : rabbitMqConnection.debug(payload);
        },
        disconnectFromLogger: function () {
            var _a;
            if (!(rabbitMqConnection === null || rabbitMqConnection === void 0 ? void 0 : rabbitMqConnection.amqpConnection) ||
                !(rabbitMqConnection === null || rabbitMqConnection === void 0 ? void 0 : rabbitMqConnection.channelConnection) ||
                !rabbitMqConnection) {
                return;
            }
            try {
                (_a = rabbitMqConnection === null || rabbitMqConnection === void 0 ? void 0 : rabbitMqConnection.amqpConnection) === null || _a === void 0 ? void 0 : _a.emit("disconnected");
            }
            catch (error) {
                return;
            }
        },
    };
})();
exports.default = LOGGER;
