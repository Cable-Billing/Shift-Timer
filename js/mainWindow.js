const electron = require('electron');
const $ = require('./js/jquery-3.4.1.min.js');
const fs = require('fs');
const { ipcRenderer } = electron;

const jsonLocation = './assests/employee.json';

let currentEmployee;
let hasBeenSaved;
let foundUser;

ipcRenderer.on('send-code', function(e, code) {
    foundUser = false;
    currentEmployee = code;
    $.getJSON(jsonLocation, function(data) {
        data.forEach(employee => {
            if (employee.employeeCode == currentEmployee) {
                currentEmployee = currentEmployee;
                document.getElementById('employeeName').innerHTML = employee.name;
                loadTimes(currentEmployee);
                foundUser = true;
            }
        });
        if (foundUser == false) {
            window.alert('User doesn\'t exist');
            ipcRenderer.send('user-error');
        }
    });
});

function relog() {
    ipcRenderer.send('relog');
}

function resetTable() {
    var table = document.getElementById('shift-data-table');
    table.innerHTML = '<tr class="heading-row"><td class="shift-start">Shift Start</td><td class="shift-end">Shift End</td><td class="hours">Hours</td></tr>';
}

function formatTime(epoch) {
    if (epoch == null) { return ""; }
    var date = new Date(epoch);
    var hours = date.getHours();
    if (hours > 12) { hours -= 12; }
    var minuites = date.getMinutes();
    if (minuites < 10) { minuites = "0" + minuites; }
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + hours + ":" + minuites;
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

                    if (shift.clockOut == null) {
                        hours.innerHTML = "0";
                    } else {
                        hours.innerHTML = (((shift.clockOut - shift.clockIn) / 1000) / 60) / 60;
                    }
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
    loadTimes(currentEmployee);
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
