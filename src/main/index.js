'use strict';

import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');
autoUpdater.on('checking-for-update', (...args) => {
  const msg = `$ checking-for-update args ${args}`;
  sendStatusToWindow(msg);
});
autoUpdater.on('update-available', (ev, info) => {
  const msg = `$ update-available ev ${ev} info ${info}`;
  sendStatusToWindow(msg);
});
autoUpdater.on('update-not-available', (ev, info) => {
  const msg = `$ update-not-available ev ${ev} info ${info}`;
  sendStatusToWindow(msg);
});
autoUpdater.on('error', (ev, err) => {
  const msg = `$ error ev ${ev} err ${err}`;
  sendStatusToWindow(msg);
});
autoUpdater.on('download-progress', (ev, progressObj) => {
  const msg = `$ download-progress ev ${ev} progressObj ${progressObj}`;
  sendStatusToWindow(msg);
});
autoUpdater.on('update-downloaded', (ev, info) => {
  const msg = `$ update-downloaded ev ${ev} info ${info}`;
  sendStatusToWindow(msg);
});

const isDevelopment = process.env.NODE_ENV !== 'production';

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('message', text);
}
function createMainWindow() {
  const window = new BrowserWindow({
    webPreferences: { nodeIntegration: true },
  });

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      }),
    );
  }

  window.on('closed', () => {
    mainWindow = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

autoUpdater.on('update-downloaded', (ev, info) => {
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 5 seconds.
  // You could call autoUpdater.quitAndInstall(); immediately
  setTimeout(function () {
    autoUpdater.quitAndInstall();
  }, 5000);
});
setInterval(() => {
  console.log(
    'sendStatusToWindow',
    sendStatusToWindow(`interval message every 5s ${new Date()} `),
  );
}, 5000);

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
  sendStatusToWindow(`current version = ${app.getVersion()}`);
  autoUpdater.checkForUpdates();
});

ipcMain.handle('test', async (event, payload) => {
  console.log('payload', payload);
  return 2;
});
