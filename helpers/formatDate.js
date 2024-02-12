"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
function formatDate(date) {
    return moment(date).format("DD/MM/YYYY HH:mm:ss SSS");
}
exports.default = formatDate;
