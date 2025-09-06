const fs = require("fs");
const os = require("os");
const path = require("path");
const axios = require("axios");
const printer = require("pdf-to-printer");
const { logger } = require("./logger");
const { isUrl } = require("./utils");

async function printFile(filePath, printerName) {
  let finalPath = filePath;
  let tempFile = null;

  try {
    if (isUrl(filePath)) {
      const response = await axios.get(filePath, {
        responseType: "arraybuffer",
      });
      tempFile = path.join(os.tmpdir(), `print_${Date.now()}.pdf`);
      fs.writeFileSync(tempFile, response.data);
      logger.info(`⬇️ Downloaded file from URL to temp: ${tempFile}`);
      finalPath = tempFile;
    }

    await printer.print(finalPath, { printer: printerName || undefined });
    logger.info(`✅ Printed successfully: ${finalPath}`);
    return { success: true };
  } catch (err) {
    logger.error(`Print failed: ${err.message}`);
    throw err;
  } finally {
    if (tempFile && fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
      logger.info(`🧹 Temp file deleted: ${tempFile}`);
    }
  }
}

module.exports = { printFile };
