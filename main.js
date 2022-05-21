const { app, BrowserWindow, screen } = require("electron");
const path = require("path");

let appWin;

createWindow = () => {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    appWin = new BrowserWindow({
        icon: "src/assets/icon.png",
        width: width,
        height: height,
        x: 0,
        y: 0,
        title: "Los Peines de Ro Desktop",
        resizable: false,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    });
    
    appWin.loadURL(`https://lospeinesdero.netlify.app`);

    appWin.setMenu(null);

    appWin.on("closed", () => {
        appWin = null;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
});