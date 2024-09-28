// const { contextBridge } = require('electron')

import { contextBridge, ipcRenderer } from "electron"
import * as path from "path"
import * as Tostify from "toastify-js"
import { homedir } from "node:os"


contextBridge.exposeInMainWorld('path', {
  join: (...args: Array<string>) => path.join(...args)
})


contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
  // we can also expose variables, not just functions
})


contextBridge.exposeInMainWorld('os', {
  homedir: homedir()
})


contextBridge.exposeInMainWorld('tosty', {
  toast: (options: any) => Tostify(options).showToast()
})


contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (chanel: string, message: any) => ipcRenderer.send(chanel, message),
  on: (chanel: string, func: (event: any, ...args: any) => void) => ipcRenderer.on(chanel, func)
})
