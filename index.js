const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, remote, ipcMain } = electron;

let mainWindow;
let loginWindow;
let newUserWindow;

// Listen for the app to be ready
app.on('ready', function () {

    mainWindow = new BrowserWindow({
        title: 'Shift Timer',
        webPreferences: {
            nodeIntegration: true
        },
        frame: true
    }); // Create new window

    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    createLogin();

    mainWindow.on('closed', function () {
        app.quit();
    });

    loginWindow.focus(); // Make main window on top
});

function createLogin() {
    loginWindow = new BrowserWindow({
        title: 'Login',
        webPreferences: {
            nodeIntegration: true
        },
        width: 250,
        height: 100,
        frame: false,
        parent: mainWindow,
        modal: true
    }); // Create new window

    // Load html into window
    loginWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'loginWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    loginWindow.setMenu(null);
}

ipcMain.on('send-code', function(e, code) {
    mainWindow.webContents.send('send-code', code);
    loginWindow.close();
    mainWindow.focus();
});

ipcMain.on('user-error', function(e) {
    createLogin();
});

ipcMain.on('exit', function(e) {
    app.quit();
});

ipcMain.on('relog', function(e) {
    createLogin();
    loginWindow.focus();
});

ipcMain.on('new-user', function(e) {
    newUserWindow = new BrowserWindow({
        title: 'Login',
        webPreferences: {
            nodeIntegration: true
        },
        width: 300,
        height: 250,
        frame: true,
    }); // Create new window

    // Load html into window
    newUserWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'newUserWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    newUserWindow.setMenu(null);

    newUserWindow.focus();
});

ipcMain.on('send-user-data', function(e, username, usercode, admin) {
    mainWindow.webContents.send('send-user-data', username, usercode, admin);
    newUserWindow.close();
    mainWindow.focus();
});