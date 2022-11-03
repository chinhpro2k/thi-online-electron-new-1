/* eslint-disable no-console */
import { app, globalShortcut, Tray } from 'electron';
import { creatAppTray } from './tray';
const { autoUpdater } = require('electron-updater');
const isDev = require('electron-is-dev');
const { dialog } = require('electron');

$tools.log.info(`Application <${$tools.APP_NAME}> launched.`);

let tray: Tray;

app.allowRendererProcessReuse = true;

const appLock = app.requestSingleInstanceLock();
if (!appLock) {
  // 作为第二个实例运行时, 主动结束进程
  app.quit();
}
app.on('second-instance', () => {
  // 当运行第二个实例时, 打开或激活首页
  $tools.createWindow('Home');
});

app.on('ready', async () => {
  tray = creatAppTray();
  $tools.createWindow('Home', {
    isInit: true,
  });
  if (!isDev) {
    autoUpdater.checkForUpdates();
  }
});

app.on('activate', () => {
  if (process.platform == 'darwin') {
    $tools.createWindow('Home');
  }
  if (!isDev) {
    autoUpdater.checkForUpdates();
  }
});
// app.on('ready', () => {
//   // Register a shortcut listener for Ctrl + Shift + I
//   globalShortcut.register('Control+Shift+I', () => {
//     // When the user presses Ctrl + Shift + I, this function will get called
//     // You can modify this function to do other things, but if you just want
//     // to disable the shortcut, you can just return false
//     return true;
//   });
// });
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  $tools.log.info(`Application <${$tools.APP_NAME}> has exited normally.`);

  if (process.platform === 'win32') {
    tray.destroy();
  }
});
autoUpdater.on(
  'update-available',
  (_event: any, releaseNotes: any, releaseName: any) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Ok'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'A new version is being downloaded.',
    };
    // @ts-ignore
    dialog.showMessageBox(dialogOpts, () => {});
  }
);
autoUpdater.on(
  'download-progress',
  function (progressObj: {
    bytesPerSecond: string;
    percent: string;
    transferred: string;
    total: string;
  }) {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
    log_message =
      log_message + ' - Downloaded ' + parseInt(progressObj.percent) + '%';
    log_message =
      log_message +
      ' (' +
      progressObj.transferred +
      '/' +
      progressObj.total +
      ')';
    sendStatusToWindow(log_message);
  }
);
function sendStatusToWindow(message: string) {
  console.log(message);
}
autoUpdater.on(
  'update-downloaded',
  (_event: any, releaseNotes: any, releaseName: any) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail:
        'A new version has been downloaded. Restart the application to apply the updates.',
    };
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall();
    });
  }
);
