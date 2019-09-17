const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, remote, ipcMain } = electron;

let mainWindow;
let loginWindow;
let newUserWindow;
let aboutWindow;
let employeeListWindow;

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
        pathname: path.join(__dirname, 'main/mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    //mainWindow.setMenu(null);

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
        pathname: path.join(__dirname, 'login/loginWindow.html'),
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
        height: 280,
        frame: true
    }); // Create new window

    // Load html into window
    newUserWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'new/newUserWindow.html'),
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

ipcMain.on('about', function(e) {
    aboutWindow = new BrowserWindow({
        title: 'About',
        webPreferences: {
            nodeIntegration: true
        },
        width: 300,
        height: 175,
        frame: true
    }); // Create new window

    // Load html into window
    aboutWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'about/aboutWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    aboutWindow.setMenu(null);

    aboutWindow.focus();
});

ipcMain.on('employee-list', function(e) {
    employeeListWindow = new BrowserWindow({
        title: 'Employee List',
        webPreferences: {
            nodeIntegration: true
        },
        width: 700,
        height: 1000,
        frame: true
    });

    employeeListWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'list/employeeListWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    employeeListWindow.setMenu(null);

    employeeListWindow.focus();
});
