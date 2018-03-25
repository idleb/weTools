'use strict'

import { app, Menu, BrowserWindow } from 'electron'
import { Wechaty, Room } from 'wechaty'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Menu
   */
  const template = [
    {
      submenu: [
        {role: 'quit', label: '退出'}
      ]
    }
  ]

  // 注册菜单
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 400,
    width: 300,
    resizable: false,
    minimizable: false,
    maximizable: false
  })

  mainWindow.webContents.closeDevTools()

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

const bot = Wechaty.instance()

global.wechaty = bot
global.findAllRooms = async (query, callback) => {
  const rooms = await Room.findAll(query)
  callback(rooms)
}
global.getImg = async (contact, callback) => {
  const avatarReadStream = await contact.avatar()
  let Writable = require('stream').Writable
  let ws = Writable()
  let chunks = []
  let size = 0
  let type = 'image/jpeg'

  ws._write = (chunk, end, next) => {
    size += chunk.length
    chunks.push(chunk)
    next()
  }

  ws.on('finish', () => {
    let buf = Buffer.concat(chunks, size)
    let base = buf.toString('base64')
    let data = ''
    if (base) {
      data = `data:${type};base64,${base}`
    }
    callback(data)
  })
  avatarReadStream.pipe(ws)
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
