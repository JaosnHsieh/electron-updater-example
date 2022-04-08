import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');
autoUpdater.on('checking-for-update', (...args) => {
  const msg = `$ checking-for-update args ${args}`;
  sendStatusToWindow(msg);
});
autoUpdater.on('update-available', (info) => {
  const msg = `$ update-available  info ${JSON.stringify(info)}`;
  sendStatusToWindow(msg);
});
autoUpdater.on('update-not-available', (info) => {
  const msg = `$ update-not-available info ${JSON.stringify(info)}`;
  sendStatusToWindow(msg);
});
autoUpdater.on('error', (ev, err) => {
  const msg = `$ error ev ${ev} err ${err}`;
  sendStatusToWindow(msg);
});
autoUpdater.on('download-progress', (payload) => {
  const msg = `$ download-progress payload ${JSON.stringify(payload)}`;
  sendStatusToWindow(msg);
});

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail:
      'A new version has been downloaded. Restart the application to apply the updates.',
  };

  sendStatusToWindow(
    `$ update-downloaded releaseNotes ${releaseNotes} releaseName ${releaseName} quitAndInstall in 20s`,
  );
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 1000 * 20);
  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall();
  });
});

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

  window.webContents.openDevTools();

  window.loadURL(`http://localhost:8080/renderer/index.html`);
  // window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);

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

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
});

ipcMain.once('renderer:js:end', () => {
  sendStatusToWindow(`current version = ${app.getVersion()}`);
  autoUpdater.checkForUpdates();
});
