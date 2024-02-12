"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
function appendToFile(filePath, content) {
    // Ensure the file path is not empty
    if (!filePath) {
        return;
    }
    var fullPath = path.resolve(filePath);
    fs.appendFile(fullPath, content + "\n", function (err) {
        if (err) {
            var errorLogPath = path.resolve("error.log");
            var errorContent = "[".concat(new Date().toISOString(), "] Error writing to log file '").concat(fullPath, "': ").concat(err.message, "\n");
            fs.appendFile(errorLogPath, errorContent, function (errorWriteErr) {
                if (errorWriteErr) {
                    //   console.error("Failed to write to the error log file.");
                }
            });
        }
    });
}
exports.default = appendToFile;
