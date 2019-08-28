const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, remote, ipcMain } = electron;

let mainWindow;

// Listen for the app to be ready
app.on('ready', function () {
    mainWindow = new BrowserWindow({ title: 'Shift Timer' }); // Create new window
    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.focus(); // Make main window on top
});