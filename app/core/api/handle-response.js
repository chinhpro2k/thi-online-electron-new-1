import { __awaiter } from "tslib";
import { Notification, BrowserWindow } from 'electron';
/**
 * 网络请求发生错误时的处理
 * 注意这个函数运行在主进程中, 请不要使用 Document API
 * @param err
 * @param sendData
 * @param options
 */
export function errorAction(err, sendData, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { code, message } = err;
        const { errorType } = options;
        // $tools.log.error(`[request:${code}] [${errorType}]`, err);
        switch (code) {
            // 跳转到未登录页
            case 30000:
                // ...
                break;
            // 无权限跳转
            case 30002:
                // ...
                break;
            default:
                const title = 'Truy vấn bị lỗi';
                if (errorType === 'notification') {
                    const n = new Notification({
                        icon: $tools.PTIT_LOGO_SQUARE,
                        title,
                        body: message,
                    });
                    n.show();
                }
                else {
                    yield $tools.createWindow('AlertModal', {
                        windowOptions: {
                            modal: true,
                            parent: BrowserWindow.getFocusedWindow() || undefined,
                            title,
                        },
                        createConfig: {
                            delayToShow: 100, // DESC 避免无边框窗口闪烁
                        },
                        query: {
                            type: 'error',
                            title,
                            message,
                        },
                    });
                }
                break;
        }
    });
}
