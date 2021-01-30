// First loads "loading.html"
// Will then display a login UI for the user to enter their bots credentials
// If they already have, it will skip straight to the main UI
// Once logged in, the main UI will be displayed
// All windows close themselves once they are no longer needed. 
// Loading screen is currently for visuals only, can be disabled if that is desired


// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
fs = require('fs');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let loginWindow
const iconPath = path.join(__dirname, "web/Images/Icons", "pink_discord.ico");

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    minWidth: 940,
    minHeight: 500,
    width: 940,
    height: 600,
    frame: false,
    backgroundColor: '#FFF',
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'web/preload.js'),
      enableRemoteModule: true
    },
    icon: iconPath
  })
  loginWindow = new BrowserWindow({
    minWidth: 940,
    minHeight: 500,
    width: 940,
    height: 600,
    frame: false,
    backgroundColor: '#FFF',
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'web/preload.js'),
      enableRemoteModule: true
    },
    icon: iconPath
  })

  fs.readFile('user_info.txt','utf8',function (err,data) {
    if(err) {
      return console.log(err);
    }
    if(data != ""){
      loginWindow.hide();
      mainWindow.loadURL('http://localhost:8000/index.html');
    }
  });
  // and load the index.html of the app.

  // mainWindow.loadURL('http://localhost:8000/goodbye.html');

  // Open the DevTools.
  // Usually only turned on during debugging and testing
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    app.quit();
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const loadingWindow = new BrowserWindow({
    frame: false,
    height: 350,
    width: 300,
    movable: false,
    backgroundColor: 'rgb(255,0,170)',
    icon: iconPath
  })

  loadingWindow.loadURL('http://localhost:8000/loading.html')
  loadingWindow.setResizable(false)
  loadingWindow.webContents.session.clearCache(function(){
    console.log("Cache cleared.")
  })
  loadingWindow.show()

  setTimeout(function(){
    console.log("Finished loading.");
    createWindow();
    loadingWindow.close();
  }, 5000)
})
// Disabled in favour of the above code
// app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
