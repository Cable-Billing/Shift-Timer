# Shift-Timer v1.0
Created by Caleb Billing for South Coast Animal Hospital

## Development Dependencies
- Electron ^6.0.5
- Electron-Packager ^14.0.4

## Using the Application
When starting the application the user will be presented with a prompt to enter thier `login code`. Upon entering a valid code they will be logged into the application.

### Standard Users
Standard users are presented with 3 options:
1. 🔑 **Relog** - Opens the login menu for another user to login.
2. ⌚ **Clock in/out** - Clocks the user in or out depending on if they are already clocked in or not. There is a 3 second delay on this so users don't acsidently clock in and then imediently out again.
3. ❗ **Erase Shifts** - Prompts the user to agree with erasing all of thier shifts.

### Admin Users
Admin users are presented with an addition 2 options:
1. 😷 **Sick Hours** - Currently doesn't do anything
2. 💻 **Add User** - Opens a window to add a new user to the system.
