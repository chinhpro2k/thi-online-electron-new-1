import path from 'path';
import electronLog from 'electron-log';
import { formatDate } from '../utils';
import { LOGS_PATH } from '../paths';
/**
 * 创建一个 electron-log 记录器
 * 参考：https://github.com/megahertz/electron-log
 */
export class SystemLogger {
    /**
     * @param logId 记录器 ID
     */
    constructor(logId) {
        this.logId = logId;
        this.logFileName = `${formatDate(new Date(), 'YYYY-MM')}.log`;
        this.logger = electronLog.create(logId);
        this.logger.transports.file.resolvePath = () => {
            return path.resolve(LOGS_PATH, this.logFileName);
        };
        const isDev = process.env.NODE_ENV === 'development' ? ' [dev]' : '';
        this.logger.transports.file.format = `[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]${isDev} {text}`;
        this.logger.transports.console.format = '[{level}] {text}';
    }
    log(...params) {
        this.logger.log(...params);
    }
    info(...params) {
        this.logger.info(...params);
    }
    warn(...params) {
        this.logger.warn(...params);
    }
    error(...params) {
        this.logger.error(...params);
    }
    debug(...params) {
        this.logger.debug(...params);
    }
    verbose(...params) {
        this.logger.verbose(...params);
    }
}
