import { app, BrowserWindow } from 'electron'

import * as fs from 'fs'
import * as path from 'path'
import * as url from 'url'
import Store from './js/store.js'

// fixes a bug where vatron would error out on first start up
const settingsPath: string = app.getPath('userData')
if(!fs.existsSync(settingsPath)) {
  fs.mkdirSync(settingsPath)
}

const settings: any = new Store({
  configName: 'settings',
  defaults: {
    dataRefresh: 60000,
    mapTheme: 'dark'
  }
})

let mainWindow: Electron.BrowserWindow

function createWindow(): void {
  mainWindow = new BrowserWindow({
    backgroundColor: '#343a40',
    frame: false,
    height: 700,
    minHeight: 56,
    minWidth: 1010,
    width: 1010,
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.setMenu(null)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if(mainWindow === null) {
    createWindow()
  }
})
