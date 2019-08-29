const electron = require('electron');
const { ipcRenderer } = electron;

window.addEventListener("keydown", function(e) {
    if (e.code == "Enter") {
        sendCode();
    }
});

function sendCode() {
    var code = document.getElementById('employeeCodeInput').value;
    ipcRenderer.send('send-code', code);
}
