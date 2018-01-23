// a clean way to store user data
// article: https://medium.com/@ccnokes/how-to-store-user-data-in-electron-3ba6bf66bc1e
// github repo: https://github.com/ccnokes/electron-tutorials/blob/master/storing-data/store.js

const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {
  constructor(opts) {
    // renderer has to get `app` module via remote, main gets it directly
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    this.path = path.join(userDataPath, opts.configName + '.json');
    this.data = parseDataFile(this.path, opts.defaults);
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  get(key) {
    return this.data[key];
  }

  set(key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    return defaults;
  }
}

module.exports = Store;