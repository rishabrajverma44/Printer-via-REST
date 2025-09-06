const express = require("express");
const bodyParser = require("body-parser");
const { logger } = require("./logger");
const { printFile } = require("./printService");
const printer = require("pdf-to-printer");

async function startServer(port) {
  const server = express();
  server.use(bodyParser.json());

  server.post("/print", async (req, res) => {
    const { printerName, filePath } = req.body;
    if (!filePath)
      return res.status(400).send({ error: "filePath is required" });

    logger.info(
      `🖨️ Print request | File: ${filePath} | Printer: ${
        printerName || "Default"
      }`
    );
    try {
      await printFile(filePath, printerName);
      res.send({ success: true });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  });

  server.get("/printers", async (_, res) => {
    try {
      const printers = await printer.getPrinters();
      logger.info(`📋 Printers requested, found: ${printers.length}`);
      res.send(printers);
    } catch (err) {
      logger.error(`Error getting printers: ${err.message}`);
      res.status(500).send({ error: err.message });
    }
  });

  server.listen(port, () => {
    logger.info(`🚀 REST API running at http://localhost:${port}`);
  });
}

module.exports = { startServer };
