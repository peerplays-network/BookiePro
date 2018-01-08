(function() {
	'use strict';
	
	var app = require('electron').app;
	var BrowserWindow = require('electron').BrowserWindow;
	var Menu = require("electron").Menu;
	var env = require('./vendor/electron_boilerplate/env_config');
	var devHelper = require('./vendor/electron_boilerplate/dev_helper');
	var windowStateKeeper = require('./vendor/electron_boilerplate/window_state');
	var fs = require('fs');
	
	var mainWindow;
	var ipcMain = require('electron').ipcMain;
	
	// Preserver of the window size and position between app launches.
	var mainWindowState = windowStateKeeper('main', {
		width: 1200,
		height: 900,
		icon: __dirname + '/icon.png'
	});
	global.guid = mainWindowState.guid;
	global.version = JSON.parse(fs.readFileSync(__dirname + "/package.json")).version;
	
//	require('electron-context-menu')({
//		showInspectElement: false,
//		labels: {
			// cut: 'Cut',
			// copy: 'Configured Copy',
			// paste: 'Configured Paste',
			// save: 'Configured Save Image',
			// copyLink: 'Configured Copy Link',
			// inspect: 'Configured Inspect'
//		},
//	});
	
	app.on('ready', function() {
		
		mainWindow = new BrowserWindow({
			x: mainWindowState.x,
			y: mainWindowState.y,
			width: mainWindowState.width,
			height: mainWindowState.height,
			icon: __dirname + '/icon.png'
		});
		
		mainWindow.setMenu(null);	
		
		if(mainWindowState.isMaximized) {
			mainWindow.maximize();
		}
		
		mainWindow.loadURL('file://' + __dirname + '/index.html');
		
		//if (env.name !== 'production') {
		//devHelper.setDevMenu();
		// mainWindow.openDevTools();
		//}
		
		var forceClose = false,
			countClicksToErrorClose = 0,
			MAX_COUNT_CLICK_TO_ERROR = 5;
		
		ipcMain.on('window-is-logout', function () {
			forceClose = true;
			app.quit();
		});
		
		
		mainWindow.on('close', function (e) {
			
			countClicksToErrorClose++;
			
			if (countClicksToErrorClose >= MAX_COUNT_CLICK_TO_ERROR) {
				mainWindow.webContents.session.clearStorageData();
			} else if (!forceClose) {
				e.preventDefault();
			}
			
			var arr = BrowserWindow.getAllWindows();
			
			for(var i = 0; i < arr.length; i++){
				var toWindow = arr[i];
				toWindow.webContents.send('window-will-close');
			}
			
			mainWindowState.saveState(mainWindow);
			
		});
		
		mainWindow.webContents.on('new-window', function(e, url) {
			e.preventDefault();
			require('electron').shell.openExternal(url);
		});
		
		// Create the Application's main menu
		
		var app_menu = process.platform === 'darwin' ?
			{
				label: "Application",
				submenu: [
					{label: "About Application", selector: "orderFrontStandardAboutPanel:"},
					{type: "separator"},
					{label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
				]
			}
			:
			{
				label: "File",
				submenu: [
					{label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
				]
			}
		
		var template = [app_menu, {
			label: "Edit",
			submenu: [
				{role: 'undo'},
				{role: 'redo'},
				{type: 'separator'},
				{role: 'cut'},
				{role: 'copy'},
				{role: 'paste'},
				{role: 'pasteandmatchstyle'},
				{role: 'delete'},
				{role: 'selectall'}
			]
		}
		// , {
		// 	label: 'View',
		// 	submenu: [{
		// 		label: 'Reload',
		// 		accelerator: 'CmdOrCtrl+R',
		// 		click: function() {
		// 			BrowserWindow.getFocusedWindow().reload();
		// 		}
		// 	}, {
		// 		label: 'Toggle DevTools',
		// 		accelerator: 'Alt+CmdOrCtrl+I',
		// 		click: function() {
		// 			BrowserWindow.getFocusedWindow().toggleDevTools();
		// 		}
		// 	}]
		// }
		];
		
		if(process.platform === 'darwin')
			Menu.setApplicationMenu(Menu.buildFromTemplate(template));
		
	});
	
	app.on('window-all-closed', function() {
		app.quit();
	});
	
})();
//# sourceMappingURL=background.js.map
