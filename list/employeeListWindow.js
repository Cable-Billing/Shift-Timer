const electron = require('electron');
const $ = require('../js/jquery-3.4.1.min.js');
const fs = require('fs');
const path = require('path');
const { ipcRenderer, remote } = electron;

function eraseShifts() {

    if (!confirm(`Are you sure you want to erase ${currentEmployee.name}'s shifts?`)) return;

    $.getJSON(jsonLocation, function (data) {
        data.forEach(employee => {
            if (employee.code == currentEmployee.code) {
                employee.shifts = [];
            }
            var json = JSON.stringify(data);
            fs.unlinkSync(jsonLocation);
            fs.appendFileSync(jsonLocation, json, function (error) {
                if (error) throw error;
                console.log('complete');
            });
        });
    });
    setTimeout(loadTimes, 100);
}