const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const { Menu } = electron;

//for window 10 modern ui lib

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1280, height: 768, minWidth: 1024, minHeight: 768, frame: false})


  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });
  console.log( "startUrl " + startUrl);

  mainWindow.loadURL(startUrl);

  // and load the index.html of the app.
  // mainWindow.loadURL('/../build/index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()


  // TODO: edit the menu as required
  //This is implmented to fix the copy paste issue in electron app for mac
  //reference: https://pracucci.com/atom-electron-enable-copy-and-paste.html
  var template = [{
    label: "Application",
    submenu: [
       { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
    ]}, {
      label: "Edit",
      submenu: [
         { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
         { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
         { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]}
    ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    // Quit the app when main window is closed
    app.quit();
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
