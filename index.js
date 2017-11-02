const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const Store = require('./js/store.js')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({width: 1010, height: 700, minWidth: 1010, frame: false})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function() {
    mainWindow = null
  })

  mainWindow.setMenu(null)

  mainWindow.webContents.openDevTools()
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
