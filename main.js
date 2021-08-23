//-------------------------------------------------------------------
// The Import section
const { app, BrowserWindow, ipcMain, ipcRenderer, Menu } = require("electron");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");
const tmp = require("tmp");
const fs = require("fs");
//-------------------------------------------------------------------
// Some variables
let updatesTrueFalse = false;
let tmpFile;
//-------------------------------------------------------------------
// TMP file
tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
	if (err) throw err;
	tmpFile = path;
	fs.writeFileSync(path, "no");
});
//-------------------------------------------------------------------
// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");
//-------------------------------------------------------------------
/* Code
* 
* Where everything starts
*/

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		frame: false,
		backgroundColor: "#FFF",
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true
		}
	});


	mainWindow.webContents.session.clearCache(function () {
		log.info("Cleared session cache");
	});
	mainWindow.loadFile("index.html");

	mainWindow.once("ready-to-show", () => {
		mainWindow.show();
	});
	mainWindow.on("closed", () => {
		mainWindow = null;
	});

	ipcMain.on("max", () => {
		mainWindow.maximize();
	});
	ipcMain.on("unmax", () => {
		mainWindow.unmaximize();
	});
	ipcMain.on("min", () => {
		mainWindow.minimize();
	});
	ipcMain.on("close", () => {
		mainWindow.close();
	});
	ipcMain.on("version", (event) => {
		event.reply("version-reply", app.getVersion());
	});
	ipcMain.on("getupdates", (event) => {
		event.reply("update-reply", updatesTrueFalse);
	});
	ipcMain.on("temp", (event) => {
		event.reply("temp-reply", tmpFile);
	});
}
app.on("ready", () => {
	autoUpdater.checkForUpdatesAndNotify();
	createWindow();
});
app.on("window-all-closed", function () {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", function () {
	if (mainWindow === null) {
		createWindow();
	}
});

autoUpdater.on("update-available", function () {
	updatesTrueFalse = true;
});