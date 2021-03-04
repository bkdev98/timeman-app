const electron = require('electron');
const path = require('path');
const url = require('url');
const { Menu } = electron;
const { app } = electron;
const { BrowserWindow } = electron;

let mainWindow;

const LOAD_URL = url.format({
  pathname: path.join(__dirname, '/webapp/build/index.html'),
  protocol: 'file:',
  slashes: true,
});

function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'Timeman',
    backgroundColor: '#FFFFFF',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      webSecurity: false,
    },
  });

  // mainWindow.webContents.openDevTools();

  mainWindow.loadURL(LOAD_URL);
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
