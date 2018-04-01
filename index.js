const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const Store = require('./js/store.js')
const fs = require('fs')

const args = process.argv

// fixes a bug where vatron would error out on first start up
let settingsPath = app.getPath('userData')
if(!fs.existsSync(settingsPath))
  fs.mkdirSync(settingsPath)

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

if(args.length > 2 && args[2].indexOf('time') == 0) {
  let lim = parseInt(args[2].substring(args[2].indexOf('=')+1))
  console.log(`running test for ${lim}s...`)
  lim *= 1000
  setTimeout(() => { console.log('pass!'), app.quit() }, lim)
}
