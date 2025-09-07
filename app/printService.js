const fs = require("fs");
const os = require("os");
const path = require("path");
const axios = require("axios");
const printer = require("pdf-to-printer");
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
      finalPath = tempFile;
    }

    await printer.print(finalPath, { printer: printerName || undefined });
    return { success: true };
  } catch (err) {
    throw err;
  } finally {
    if (tempFile && fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
}

module.exports = { printFile };
