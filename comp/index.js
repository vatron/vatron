"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var fs = require("fs");
var path = require("path");
var url = require("url");
var store_js_1 = require("./js/store.js");
// fixes a bug where vatron would error out on first start up
var settingsPath = electron_1.app.getPath('userData');
if (!fs.existsSync(settingsPath)) {
    fs.mkdirSync(settingsPath);
}
var settings = new store_js_1["default"]({
    configName: 'settings',
    defaults: {
        dataRefresh: 60000,
        mapTheme: 'dark'
    }
});
var mainWindow;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        backgroundColor: '#343a40',
        frame: false,
        height: 700,
        minHeight: 56,
        minWidth: 1010,
        width: 1010
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
    mainWindow.setMenu(null);
}
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', function () {
    electron_1.app.quit();
});
electron_1.app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
//# sourceMappingURL=index.js.map