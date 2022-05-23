const { app, BrowserWindow, screen } = require("electron");
const path = require("path");
const { electron } = require("process");

let appWin;

if (handleSquirrelEvent(app)) {
    // evento de squirrel manejado y la aplicación se cerrará en 1000 ms, así que no hagas nada más
}

function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Opcionalmente, haga cosas como:
            // - Agregue su .exe a la RUTA
            // - Escriba en el registro para cosas como asociaciones de archivos y
            //   menús contextuales del explorador

            // Instalar accesos directos del menú de inicio y del escritorio
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Deshace todo lo que hiciste en el --squirrel-install y
            // --squirrel-updated handlers

            // Eliminar los accesos directos del escritorio y del menú de inicio
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-obsolete':
             // Esto se llama en la versión saliente de su aplicación antes
             // Actualizamos a la nueva versión - es lo contrario de
             // --update squirrel

            application.quit();
            return true;
    }
};

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