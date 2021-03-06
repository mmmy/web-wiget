const { app, BrowserWindow, globalShortcut, Menu, MenuItem } = require('electron')
const config = require('./config')
const menu = new Menu()

// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win

menu.append(new MenuItem({
  label: 'opacity -',
  accelerator: 'CmdOrCtrl+Shift+down',
  click: () => {
    let opacity = win.getOpacity()
    if (opacity > 0) {
      win.setOpacity(opacity - 0.1)
    }
  }
}))
menu.append(new MenuItem({
  label: 'opacity +',
  accelerator: 'CmdOrCtrl+Shift+up',
  click: () => {
    let opacity = win.getOpacity()
    if (opacity < 1) {
      win.setOpacity(opacity + 0.1)
    }
  }
}))
menu.append(new MenuItem({
  label: '刷新',
  accelerator: 'CmdOrCtrl+R',
  click: () => {
    win.reload()
  }
}))
Menu.setApplicationMenu(menu)

function createWindow() {
  // 创建浏览器窗口。
  win = new BrowserWindow({ width: config.width, height: config.height, frame: true, opacity: 0.5, autoHideMenuBar: true })
  // win.setIgnoreMouseEvents(true)
  // 然后加载应用的 index.html。
  // http://202.182.125.82:3000/d/gJbFdjwmk/combined?orgId=1&refresh=30s&from=now-7d&to=now
  win.loadURL(config.url)

  // 打开开发者工具
  // win.webContents.openDevTools()
  win.minimize()
  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })

  globalShortcut.register(config.toggleKey, () => {
    if (win.isMinimized()) {
      win.restore()
    } else {
      win.minimize()
    }
  })
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow()
  }
})

app.on('browser-window-blur', () => {
  // win.frame = false
})

app.on('browser-window-focus', () => {
  // console.log('focus')
  // win.minimize()
  win.frame = true
})