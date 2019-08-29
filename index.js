const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, remote, ipcMain } = electron;

let mainWindow;
let loginWindow;

// Listen for the app to be ready
app.on('ready', function () {

    mainWindow = new BrowserWindow({
        title: 'Shift Timer',
        webPreferences: {
            nodeIntegration: true
        }
    }); // Create new window

    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    loginWindow = new BrowserWindow({
        title: 'Login',
        webPreferences: {
            nodeIntegration: true
        },
        width: 350,
        height: 175
    }); // Create new window

    // Load html into window
    loginWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'loginWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', function () {
        app.quit();
    });

    loginWindow.focus(); // Make main window on top
});

ipcMain.on('send-code', function(e, code) {
    mainWindow.webContents.send('send-code', code);
    loginWindow.close();
    mainWindow.focus();
});