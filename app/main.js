// app/main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");
const { logger } = require("./logger");
const { startServer } = require("./server");
const { setupLogCleanup } = require("./logCleanup");
const { getAvailablePort } =
  require("./getAvailablePort.js").default || require("./getAvailablePort.js");

let mainWindow;

/**
 * Create the main Electron window
 */
async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Correctly load index.html in development and after packaging
  const indexPath = path.join(__dirname, "index.html");
  mainWindow.loadFile(indexPath);

  logger.info("Electron window created");
}

/**
 * Get port 9900 or throw error if busy
 */
async function getPortToUse() {
  const desiredPort = 9900;
  const port = await getAvailablePort();
  if (port !== desiredPort) {
    throw new Error(`Port ${desiredPort} is already in use.`);
  }
  logger.info(`✅ Using fixed port: ${port}`);
  return port;
}

/**
 * Initialize the app
 */
async function initApp() {
  try {
    logger.info("📂 Application starting...");
    const port = await getPortToUse();
    await startServer(port);
    setupLogCleanup();
    await createWindow();
  } catch (err) {
    console.error("Startup failed:", err.message);
    logger.error("Startup failed: " + err.message);
    app.quit();
  }
}

// App ready
app.whenReady().then(initApp);

// Quit when all windows closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    logger.info("🛑 Application closed");
    app.quit();
  }
});
