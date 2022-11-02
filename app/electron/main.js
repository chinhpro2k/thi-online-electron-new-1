import { __awaiter } from "tslib";
/* eslint-disable no-console */
import { app } from 'electron';
import { creatAppTray } from './tray';
$tools.log.info(`Application <${$tools.APP_NAME}> launched.`);
let tray;
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
app.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    tray = creatAppTray();
    $tools.createWindow('Home', {
        isInit: true,
    });
}));
app.on('activate', () => {
    if (process.platform == 'darwin') {
        $tools.createWindow('Home');
    }
});
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
