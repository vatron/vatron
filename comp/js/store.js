"use strict";
// a clean way to store user data
// article: https://medium.com/@ccnokes/how-to-store-user-data-in-electron-3ba6bf66bc1e
// github repo: https://github.com/ccnokes/electron-tutorials/blob/master/storing-data/store.js
exports.__esModule = true;
var electron_1 = require("electron");
var fs = require("fs");
var path = require("path");
var Store = /** @class */ (function () {
    function Store(opts) {
        // renderer has to get `app` module via remote, main gets it directly
        var userDataPath = (electron_1.app || electron_1.remote.app).getPath('userData');
        this.path = path.join(userDataPath, opts.configName + '.json');
        this.data = parseDataFile(this.path, opts.defaults);
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }
    Store.prototype.get = function (key) {
        return this.data[key];
    };
    Store.prototype.set = function (key, val) {
        this.data[key] = val;
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    };
    return Store;
}());
exports["default"] = Store;
function parseDataFile(filePath, defaults) {
    try {
        return JSON.parse(fs.readFileSync(filePath).toString());
    }
    catch (error) {
        return defaults;
    }
}
//# sourceMappingURL=store.js.map