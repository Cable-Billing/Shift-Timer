const electron = require('electron');
const { ipcRenderer } = electron;
const $ = require('jquery');

ipcRenderer.on('send-code', function(e, code) {
    $.getJSON('./assests/employee.json', function(data) {
        data.forEach(employee => {
            if (employee.employeeCode == code) {
                document.getElementById('employeeName').innerHTML = employee.name;
            } else {
                window.alert('User doesn\'t exist');
                ipcRenderer.send('user-error');
            }
        });
    });
});