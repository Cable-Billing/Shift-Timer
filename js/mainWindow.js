const electron = require('electron');
const $ = require('./js/jquery-3.4.1.min.js');
const fs = require('fs');
const path = require('path');
const { ipcRenderer, remote } = electron;

const jsonLocation = path.resolve('./assets/employee.json');

let currentEmployee;
let hasBeenSaved = false;
let foundUser = false;
let cooldown = false;

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
            window.alert(`User doesn't exist`);
            ipcRenderer.send('user-error');
        } else {
            if (currentEmployee.admin) {
                // Add admin buttons
                document.getElementById("employee-list").style.display = "block";
                document.getElementById("sick-user").style.display = "block";
                document.getElementById("new-user").style.display = "block";
            } else {
                // Remove admin buttons
                document.getElementById("employee-list").style.display = "none";
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
    var ampm = "am";
    var date = new Date(epoch);
    var hours = date.getHours();
    if (hours > 12) { hours -= 12; ampm = "pm"}
    var minuites = date.getMinutes();
    if (minuites < 10) { minuites = `0${minuites}`; }
    return `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()} ${hours}:${minuites}${ampm}`;
}

function loadTimes() {
    var table = document.getElementById('shift-data-table');
    resetTable();
    var totalTime = 0;

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
                        time = ((((shift.clockOut - shift.clockIn) / 1000) / 60) / 60).toFixed(2);
                        totalTime += parseFloat(time);
                        hours.innerHTML = time;
                    }
                });
            }
        });
        totalRowCount = $("#shift-data-table tr").length;
        var row = table.insertRow(totalRowCount);
        row.insertCell(0);
        row.insertCell(1);
        row.insertCell(2).innerHTML = `<b>Total: ${totalTime}</b>`;
    });
}

function clock() {
    if (cooldown) return;
    hasBeenSaved = false;
    $.getJSON(jsonLocation, function(data) {
        data.forEach(employee => {
            if (employee.code == currentEmployee.code) {
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
    cooldown = true;
    document.getElementById('clock').innerHTML = "<b>3</b>";
    setTimeout(function() {
        document.getElementById('clock').innerHTML = "<b>2</b>";
    }, 1000);
    setTimeout(function () {
        document.getElementById('clock').innerHTML = "<b>1</b>";
    }, 2000);
    setTimeout(function () {
        document.getElementById('clock').innerHTML = "&#8986";
        cooldown = false;
    }, 3000);
}

// Save the JSON
function saveData(data) {
    if (hasBeenSaved) { console.log('Already altered'); return; }

    var json = JSON.stringify(data);
    fs.unlinkSync(jsonLocation);
    fs.appendFileSync(jsonLocation, json, function(error) {
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

function employeeListWindow() {
    ipcRenderer.send('employee-list');
}

function about() {
    ipcRenderer.send('about');
}