const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, remote, ipcMain } = electron;

let mainWindow;
let loginWindow;

// Listen for the app to be ready
app.on('ready', function () {
    mainWindow = new BrowserWindow({ title: 'Shift Timer' }); // Create new window
    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    loginWindow = new BrowserWindow({ title: 'Login', width: 350, height: 175 }); // Create new window
    // Load html into window
    loginWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'loginWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    loginWindow.focus(); // Make main window on top
});
