// a clean way to store user data
// article: https://medium.com/@ccnokes/how-to-store-user-data-in-electron-3ba6bf66bc1e
// github repo: https://github.com/ccnokes/electron-tutorials/blob/master/storing-data/store.js

import {app, remote} from 'electron'
import * as fs from 'fs'
import * as path from 'path'

export default class Store {
  private path: string
  private data: any

  constructor(opts: any) {
    // renderer has to get `app` module via remote, main gets it directly
    const userDataPath = (app || remote.app).getPath('userData')
    this.path = path.join(userDataPath, opts.configName + '.json')
    this.data = parseDataFile(this.path, opts.defaults)
    fs.writeFileSync(this.path, JSON.stringify(this.data))
  }

  public get(key: string | number): any {
    return this.data[key]
  }

  public set(key: string | number, val: any): void {
    this.data[key] = val
    fs.writeFileSync(this.path, JSON.stringify(this.data))
  }
}

function parseDataFile(filePath: string, defaults: object) {
  try {
    return JSON.parse(fs.readFileSync(filePath).toString())
  } catch(error) {
    return defaults
  }
}
