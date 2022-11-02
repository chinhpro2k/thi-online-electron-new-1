import { __awaiter } from "tslib";
import path from 'path';
import { BrowserWindow, screen, ipcMain, systemPreferences,
// desktopCapturer,
 } from 'electron';
// import ioHook from 'iohook';
// import drivelist from 'drivelist';
import usbDetect from 'usb-detection';
import { log } from '../log';
import routes from '@/src/auto-routes';
const { NODE_ENV, port, host } = process.env;
/** 已创建的窗口列表 */
export const windowList = new Map();
/**
 * 通过 routes 中的 key(name) 得到 url
 * @param key
 */
export function getWindowUrl(key, options = {}) {
    var _a;
    let routePath = (_a = routes.get(key)) === null || _a === void 0 ? void 0 : _a.path;
    if (typeof routePath === 'string' && options.params) {
        routePath = routePath.replace(/\:([^\/]+)/g, (_, $1) => {
            return options.params[$1];
        });
    }
    const query = options.query ? $tools.toSearch(options.query) : '';
    if (NODE_ENV === 'development') {
        return `http://${host}:${port}#${routePath}${query}`;
    }
    else {
        return `file://${path.join(__dirname, '../renderer/index.html')}#${routePath}${query}`;
    }
}
/**
 * 创建一个新窗口
 * @param key
 * @param options
 */
export function createWindow(key, options = {}) {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        const routeConfig = routes.get(key) || {};
        const windowOptions = Object.assign(Object.assign(Object.assign({}, $tools.DEFAULT_WINDOW_OPTIONS), routeConfig.windowOptions), options.windowOptions);
        let splash;
        if (options.isInit) {
            splash = createSplashWindow();
            splash.on('closed', () => (splash = undefined));
            windowOptions.show = false;
        }
        const createConfig = Object.assign(Object.assign(Object.assign({}, $tools.DEFAULT_CREATE_CONFIG), routeConfig.createConfig), options.createConfig);
        let activeWin;
        if (createConfig.single) {
            activeWin = activeWindow(key);
            if (activeWin) {
                resolve(activeWin);
                return activeWin;
            }
        }
        const win = new BrowserWindow(windowOptions);
        if (!options.isInit) {
            win.maximize();
        }
        if (process.platform == 'darwin') {
            let access = yield systemPreferences.askForMediaAccess('camera');
            while (access != true) {
                access = yield systemPreferences.askForMediaAccess('camera');
            }
        }
        const url = getWindowUrl(key, options);
        windowList.set(key, win);
        win.loadURL(url);
        // ioHook.on('mouseclick', (event) => {
        //   win.webContents.send('mouseclick');
        // });
        // ioHook.start();
        if (createConfig.saveWindowBounds) {
            const lastBounds = $tools.settings.windowBounds.get(key);
            if (lastBounds)
                win.setBounds(lastBounds);
        }
        if (createConfig.hideMenus)
            win.setMenuBarVisibility(false);
        if (createConfig.created)
            createConfig.created(win);
        // ipcMain event: on renderer requiring screen+maximizing information
        const evidence = [];
        // ipcMain.on('violate-face', (event, arg) => {
        //   desktopCapturer
        //     .getSources({
        //       types: ['screen'],
        //       thumbnailSize: { width: 640, height: 480 },
        //     })
        //     .then((sources) => {
        //       evidence.push({
        //         img: sources.map((a) => a.thumbnail.toBitmap()),
        //         violations: [arg],
        //         timestamp: new Date().toLocaleTimeString(),
        //       });
        //     });
        // });
        usbDetect.startMonitoring();
        ipcMain.on('get-proctor', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const usbList = [];
                const displays = screen.getAllDisplays();
                // const drives = await drivelist.list();
                // const removables = drives.filter((a) => a.isUSB === true);
                // usbList = await usbDetect.find();
                const dt = new Date().toLocaleTimeString();
                win.webContents.send('update-proctor', [
                    dt,
                    displays.length,
                    win.isMaximized(),
                    usbList.map((x) => x.deviceName).toString(),
                ]);
                // const violations: string[] = [];
                // if (displays.length > 1) {
                //   violations.push('Nhiều màn hình');
                // }
                // if (!win.isMaximized()) {
                //   violations.push('Không phóng to cửa sổ');
                // }
                // if (violations.length > 0) {
                //   desktopCapturer
                //     .getSources({
                //       types: ['screen'],
                //       thumbnailSize: { width: 640, height: 480 },
                //     })
                //     .then((sources) => {
                //       evidence.push({
                //         img: sources.map((a) => a.thumbnail.toBitmap()),
                //         violations: violations,
                //         timestamp: new Date().toLocaleTimeString(),
                //       });
                //     });
                // }
            }
            catch (error) {
                console.log(`error`, JSON.stringify(error));
            }
        }));
        win.webContents.on('dom-ready', () => {
            win.webContents.send('dom-ready', createConfig);
        });
        win.webContents.on('did-finish-load', () => {
            if (options.isInit) {
                splash && !splash.isDestroyed() && splash.close();
                win.maximize();
                win.focus();
                return resolve(win);
            }
            if (createConfig.autoShow) {
                if (createConfig.delayToShow) {
                    setTimeout(() => {
                        win.show();
                    }, createConfig.delayToShow);
                }
                else {
                    win.show();
                }
            }
            resolve(win);
        });
        win.once('ready-to-show', () => {
            if (createConfig.openDevTools)
                win.webContents.openDevTools();
        });
        win.once('show', () => {
            log.info(`Window <${key}:${win.id}> url: ${url} opened.`);
        });
        win.on('close', () => {
            if (createConfig.saveWindowBounds && win) {
                $tools.settings.windowBounds.set(key, win.getBounds());
            }
            windowList.delete(key);
            usbDetect.stopMonitoring();
            // ioHook.stop();
            log.info(`Window <${key}:${win.id}> closed.`);
        });
        win.on('blur', () => {
            win.webContents.send('blur', 'Chuyển ứng dụng khác: ' + new Date().toLocaleTimeString());
            // desktopCapturer
            //   .getSources({
            //     types: ['screen'],
            //     thumbnailSize: { width: 640, height: 480 },
            //   })
            //   .then((sources) => {
            //     evidence.push({
            //       img: sources.map((a) => a.thumbnail.toBitmap()),
            //       violations: ['Bật ứng dụng khác'],
            //       timestamp: new Date().toLocaleTimeString(),
            //     });
            //   });
        });
    }));
}
/**
 * 激活一个已存在的窗口, 成功返回 BrowserWindow 失败返回 false
 * @param key
 */
export function activeWindow(key) {
    const win = windowList.get(key);
    if (win) {
        win.show();
        return win;
    }
    else {
        return false;
    }
}
export function createSplashWindow() {
    const splash = new BrowserWindow({
        width: 500,
        height: 280,
        frame: false,
        skipTaskbar: true,
        resizable: false,
        alwaysOnTop: true,
        transparent: true,
    });
    const url = `file://${path.join(__dirname, '../../assets/splash.html')}`;
    splash.loadURL(url);
    return splash;
}
