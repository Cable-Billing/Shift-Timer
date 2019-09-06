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
    $.getJSON(jsonLocation, function(data) {
        data.forEach(employee => {
            if (employee.code == code) {
                currentEmployee = employee;
                document.getElementById('employeeName').innerHTML = employee.name;
                loadTimes();
                foundUser = true;
            }
        });
        if (foundUser == false) {
            window.alert('User doesn\'t exist');
            ipcRenderer.send('user-error');
        } else {
            if (currentEmployee.admin) {
                // Add admin buttons
                document.getElementById("sick-user").style.display = "block";
                document.getElementById("new-user").style.display = "block";
            } else {
                // Remove admin buttons
                document.getElementById("sick-user").style.display = "none";
                document.getElementById("new-user").style.display = "none";
            }
        }
    });
});

function relog() {
    ipcRenderer.send('relog');
}

function resetTable() {
    var table = document.getElementById('shift-data-table');
    table.innerHTML = '<tr class="heading-row"><th class="shift-start">Shift Start</th><th class="shift-end">Shift End</th><th class="hours">Hours</td></tr>';
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

function loadTimes() {
    var table = document.getElementById('shift-data-table');
    resetTable();

    $.getJSON(jsonLocation, function(data) {
        data.forEach(employee => {
            if (employee.code == currentEmployee.code) {
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
                        hours.innerHTML = ((((shift.clockOut - shift.clockIn) / 1000) / 60) / 60).toFixed(2);
                        // hours.innerHTML = ((shift.clockOut - shift.clockIn) / 1000).toFixed(2);
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
            if (employee.code == currentEmployee) {
                // The correct employee has been selected

                var table = document.getElementById('shift-data-table');

                // Get the current time
                var date = new Date();
                var currentTime = date.getTime();

                //Find an open slot to clock out
                employee.shifts.forEach(shift => {
                    if (shift.clockOut == null) {
                        // Add the time to the JSON
                        shift.clockOut = currentTime;

                        //Save data
                        saveData(data);
                    }
                });

                // Checked everything so they must be clocking in
                employee.shifts.push({ "clockIn": currentTime, "clockOut": null });

                //Save data
                saveData(data);
            }
        });
    });
    setTimeout(loadTimes, 100);
}

// Save the JSON
function saveData(data) {
    if (hasBeenSaved) { console.log('Already altered'); return; }

    var json = JSON.stringify(data);
    fs.writeFile(jsonLocation, json, function(error) {
        if (error) throw error;
        console.log('complete');
    });
    hasBeenSaved = true;
}

ipcRenderer.on('send-user-data', function(e, username, userCode, admin) {
    hasBeenSaved = false;
    var newuser = new Object();
    newuser.name = username;
    newuser.code = userCode;

    if (admin) {
        newuser.admin = true;
    } else {
        newuser.admin = false;
    }

    newuser.shifts = [];

    $.getJSON(jsonLocation, function(data) {
        data.push(newuser);
        saveData(data);
    });

    window.alert('New user has been created.');
});

function newUserWindow() {
    ipcRenderer.send('new-user');
}