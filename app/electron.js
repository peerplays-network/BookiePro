// Dependencies
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

const path = require('path');
const isDev = require('electron-is-dev');

var mainWindow;

// Create the Main window that loads the web app.
function createWindow() {
  var menu;

  mainWindow = new BrowserWindow({
    width: 1280, 
    height: 768, 
    minWidth: 1024, 
    minHeight: 768, 
    frame: false
  });
  
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '/index.html')}`);

  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    // Quit the app when main window is closed
    app.quit();
  });

  // Show window when it first loads.
  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.show();
    
    // Open developer tools.
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  //This is implmented to fix the copy paste issue in electron app for mac
  //reference: https://pracucci.com/atom-electron-enable-copy-and-paste.html
  menu = Menu.buildFromTemplate([
    {
      label: 'Application',
      submenu: [
        { 
          label: 'Quit', 
          accelerator: 'Command+Q', 
          click: function() { 
            app.quit();
          }
        }
      ]
    }, 
    {
      label: 'Edit',
      submenu: [
        { 
          label: 'Copy', 
          accelerator: 'CmdOrCtrl+C', 
          selector: 'copy:' 
        },
        { 
          label: 'Paste', 
          accelerator: 'CmdOrCtrl+V', 
          selector: 'paste:' 
        },
        { 
          label: 'Select All', 
          accelerator: 'CmdOrCtrl+A', 
          selector: 'selectAll:' 
        }
      ]
    }
  ]);

  Menu.setApplicationMenu(menu);

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  // TODO: Recreate or show?
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});
