const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { startServer } = require("./server");
const { getAvailablePort } = require("./getAvailablePort");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const indexPath = path.join(__dirname, "index.html");
  mainWindow.loadFile(indexPath);
}

async function initApp() {
  try {
    const port = await getAvailablePort();
    await startServer(port, (msg) => {
      // forward logs from server to renderer
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send("api-log", msg);
      }
    });
    createWindow();
  } catch (err) {
    console.error("Startup failed:", err.message);
    app.quit();
  }
}

app.whenReady().then(initApp);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
