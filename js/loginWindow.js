const electron = require('electron');
const { ipcRenderer } = electron;

window.addEventListener("keydown", function(e) {
    if (e.code == "Enter") {
        sendCode();
    } else if (e.code == "Escape") {
        ipcRenderer.send('exit');
    }
});

function sendCode() {
    var code = document.getElementById('employeeCodeInput').value;
    ipcRenderer.send('send-code', code);
}

function exit() {
    ipcRenderer.send('exit');
}