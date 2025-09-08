const express = require("express");
const bodyParser = require("body-parser");
const { printFile } = require("./printService");
const printer = require("pdf-to-printer");

async function startServer(port, logFn) {
  const server = express();
  server.use(bodyParser.json());

  server.post("/print", async (req, res) => {
    const { printerName, filePath } = req.body;
    logFn?.(
      `Incoming /print request: file=${filePath}, printer=${printerName}`
    );

    if (!filePath) {
      logFn?.("Missing filePath");
      return res.status(400).send({ error: "filePath is required" });
    }

    try {
      await printFile(filePath, printerName);
      logFn?.(`Printing process started with ${printerName}`);
      res.send({ success: true });
    } catch (err) {
      logFn?.(`Print failed: ${err.message}`);
      res.status(500).send({ error: err.message });
    }
  });

  server.get("/printers", async (_, res) => {
    logFn?.("Fetching printers list...");
    try {
      const printers = await printer.getPrinters();
      logFn?.(`Found ${printers.length} printers`);
      logFn?.(
        "--------------------------------------------------------------------"
      );
      printers.map((printer) => {
        return logFn?.(`printer-id: ${printer.deviceId}`);
      });
      res.send(printers);
    } catch (err) {
      logFn?.(`Error fetching printers: ${err.message}`);
      res.status(500).send({ error: err.message });
    }
  });

  server.listen(port, () => {
    logFn?.(`REST API running at http://localhost:${port}`);
  });
}

module.exports = { startServer };
