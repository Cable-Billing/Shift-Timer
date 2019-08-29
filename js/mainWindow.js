const electron = require('electron');
const { ipcRenderer } = electron;

ipcRenderer.on('send-code', function(e, code) {
    document.getElementById('employeeName').innerHTML = code;
});