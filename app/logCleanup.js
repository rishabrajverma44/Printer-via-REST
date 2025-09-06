const fs = require("fs");
const path = require("path");
const { logger, logDir } = require("./logger");

function setupLogCleanup() {
  setInterval(() => {
    try {
      if (!fs.existsSync(logDir)) return;

      const files = fs.readdirSync(logDir);
      const now = new Date();
      const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;

      files.forEach((file) => {
        const filePath = path.join(logDir, file);
        const stats = fs.statSync(filePath);
        if (now - stats.mtime > twoDaysInMs) {
          fs.unlinkSync(filePath);
          logger.info(`🗑️ Deleted old log file: ${file}`);
        }
      });
    } catch (err) {
      console.error("Error cleaning logs:", err.message);
    }
  }, 60 * 60 * 1000); // every hour
}

module.exports = { setupLogCleanup };
