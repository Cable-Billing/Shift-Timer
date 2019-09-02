const electron = require('electron');
const { ipcRenderer } = electron;
const $ = require('jquery');
const fs = require('fs');

const jsonLocation = './assests/employee.json';

let currentEmployee;
let hasBeenSaved;

ipcRenderer.on('send-code', function(e, code) {
    $.getJSON(jsonLocation, function(data) {
        data.forEach(employee => {
            if (employee.employeeCode == code) {
                currentEmployee = code;
                document.getElementById('employeeName').innerHTML = employee.name;
            } else {
                window.alert('User doesn\'t exist');
                ipcRenderer.send('user-error');
            }
        });
    });
});

function relog() {
    ipcRenderer.send('relog');
}

function clock() {
    hasBeenSaved = false;
    $.getJSON(jsonLocation, function(data) {
        data.forEach( employee => {
            if (employee.employeeCode == currentEmployee) {
                // The correct employee has been selected

                // Get the current time
                var date = new Date();
                var currentTime = date.getTime();

                // If there is nothing in the shifts array add a new clock in
                if (employee.shifts.length == 0) {
                    employee.shifts.push({ "clockIn": currentTime, "clockOut": null });
                    saveData(data);
                }

                //Find an open slot to clock out
                employee.shifts.forEach(shift => {
                    if (shift.clockOut == null) {
                        shift.clockOut = currentTime;
                        saveData(data);
                    }
                });

                // Checked everything so they must be clocking in
                employee.shifts.push({ "clockIn": currentTime, "clockOut": null });
                saveData(data);
            }
        });
    });    
}

// Save the JSON
function saveData(data) {
    if (hasBeenSaved) { console.log('Already altered'); return; }
    
    var json = JSON.stringify(data);
    fs.writeFile(jsonLocation, json, function (error) {
        if (error) throw error;
        console.log('complete');
    });
    hasBeenSaved = true;
}
