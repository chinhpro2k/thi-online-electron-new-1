/* eslint-disable no-console */
import { app, globalShortcut, Tray } from 'electron';
import { creatAppTray } from './tray';
const { autoUpdater, dialog } = require('electron');

$tools.log.info(`Application <${$tools.APP_NAME}> launched.`);

let tray: Tray;

app.allowRendererProcessReuse = true;
const server = 'https://your-deployment-url.com';
const url = `${server}/update/${process.platform}/${app.getVersion()}`;

setInterval(() => {
  autoUpdater.checkForUpdates();
}, 60000);

autoUpdater.setFeedURL({ url });

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
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
});
autoUpdater.on('error', (message) => {
  console.error('There was a problem updating the application');
  console.error(message);
});
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
});

app.on('activate', () => {
  if (process.platform == 'darwin') {
    $tools.createWindow('Home');
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
