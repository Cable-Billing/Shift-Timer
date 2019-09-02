const electron = require('electron');
const $ = require('jquery');
const fs = require('fs');
const { ipcRenderer } = electron;

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
    loadTimes(code);
});

function relog() {
    ipcRenderer.send('relog');
}

function resetTable() {
    var table = document.getElementById('shift-data-table');
    table.innerHTML = '<tr class="heading-row"><td class="shift-start">Shift Start</td><td class="shift-end">Shift End</td><td class="hours">Hours</td></tr>';
}

function formatTime(epoch) {
    var date = new Date(epoch);
    var formattedTime = "";
    return date.getDate() + "/" + (date.getMonth + 1) + "/" + date.getFullYear + " " + date.getHours + ":" + date.getMinutes;
}

function loadTimes(code) {
    var table = document.getElementById('shift-data-table');
    resetTable();

    $.getJSON(jsonLocation, function(data) {
        data.forEach(employee => {
            if (employee.employeeCode == code) {
                employee.shifts.forEach(shift => {
                    var row = table.insertRow(1);
                    var clockInTime = row.insertCell(0);
                    var clockOutTime = row.insertCell(1);
                    var hours = row.insertCell(2);

                    clockInTime.innerHTML = formatTime(shift.clockIn);
                    clockOutTime.innerHTML = formatTime(shift.clockOut);
                    hours.innerHTML = formatTime(shift.clockOut - shift.clockIn);
                });
            }
        });
    });
}

function clock() {
    hasBeenSaved = false;
    $.getJSON(jsonLocation, function(data) {
        data.forEach(employee => {
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
