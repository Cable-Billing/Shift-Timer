const electron = require('electron');
const { ipcRenderer } = electron;

function sendUser() {
    var username = document.getElementById('username').value;
    var usercode = document.getElementById('usercode').value;
    var admin = document.getElementById('admin').checked;
    ipcRenderer.send('send-user-data', username, usercode, admin);
}