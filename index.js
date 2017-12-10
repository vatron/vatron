const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const Store = require('./js/store.js')

const settings = new Store({
  configName: 'settings',
  defaults: {
    dataRefresh: 60000,
    mapTheme: 'dark'
  }
})

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({width: 1010, height: 700, minWidth: 1010, minHeight: 56, frame: false, backgroundColor: '#343a40'})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function() {
    mainWindow = null
  })

  mainWindow.setMenu(null)
}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
  app.quit()
})

app.on('activate', function() {
  if(mainWindow === null) {
    createWindow()
  }
})
