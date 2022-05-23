// C:\Users\sdkca\Desktop\electron-workspace\build.js
var electronInstaller = require('electron-winstaller');

// En este caso, podemos usar rutas relativas
var settings = {
    // Especifique la carpeta donde se encuentra la aplicación construida
    appDirectory: './out/los-peines-de-ro-desktop-win32-x64',
    // Especifique la carpeta existente donde
    outputDirectory: './build',
    // El nombre del autor de la aplicación (el nombre de su empresa)
    authors: 'Edu García',
    // El nombre del ejecutable de tu ejecutable
    exe: './los-peines-de-ro-desktop.exe',
    description: 'Gestión de reservas de peluquería',
    setupExe: './LosPeinesDeRoSetup.exe',
    setupMsi: './LosPeinesDeRoSetup.msi',
    name: 'Los Peines de Ro Desktop',
    title: 'Los Peines de Ro Desktop'
};

resultPromise = electronInstaller.createWindowsInstaller(settings);
 
resultPromise.then(() => {
    console.log("¡Los instaladores de su aplicación se crearon con éxito!");
}, (e) => {
    console.log(`Bueno, a veces no tienes tanta suerte: ${e.message}`)
});