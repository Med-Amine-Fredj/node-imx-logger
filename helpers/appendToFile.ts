import * as fs from "fs";
import * as path from "path";

function appendToFile(filePath: string, content: string) {
  if (!filePath) {
    return;
  }

  const fullPath = path.resolve(filePath);

  fs.appendFile(fullPath, content + "\n", (err) => {
    if (err) {
      const errorLogPath = path.resolve("error.log");
      const errorContent = `[${new Date().toISOString()}] Error writing to log file '${fullPath}': ${
        err.message
      }\n`;
      fs.appendFile(errorLogPath, errorContent, (errorWriteErr) => {
        if (errorWriteErr) {
          //   console.error("Failed to write to the error log file.");
        }
      });
    }
  });
}

export default appendToFile;
