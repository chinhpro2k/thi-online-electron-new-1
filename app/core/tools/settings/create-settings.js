import fs from 'fs';
import path from 'path';
import { USER_DATA_PATH } from '../paths';
import { log } from '../log';
export class CreateSettings {
    /**
     * 创建一个设置项集合 (json)
     * @param name 集合名称
     * @param folderPath 存放 json 的文件夹
     */
    constructor(name, folderPath) {
        this.name = name;
        this.folderPath = folderPath;
        this.settingsPath = folderPath !== null && folderPath !== void 0 ? folderPath : path.resolve(USER_DATA_PATH, 'settings');
        this.filePath = path.resolve(this.settingsPath, `${name}.settings.json`);
    }
    hasSettingsFile() {
        const hasFile = fs.existsSync(this.filePath);
        if (hasFile) {
            return true;
        }
        else if (!fs.existsSync(this.settingsPath)) {
            fs.mkdirSync(this.settingsPath, { recursive: true });
        }
        return false;
    }
    createSettingsFile() {
        fs.writeFileSync(this.filePath, '{}');
        log.info(`Create settings file <${this.name}> path: ${this.filePath}`);
    }
    /** 通过 key 获取单个配置 */
    get(key) {
        let config = {};
        if (this.hasSettingsFile()) {
            const configStr = fs.readFileSync(this.filePath, 'utf-8');
            try {
                config = JSON.parse(configStr);
            }
            catch (error) {
                log.error(error);
            }
        }
        else {
            config = {};
            this.createSettingsFile();
        }
        if (key) {
            return config[key];
        }
        else {
            return config;
        }
    }
    /**
     * 写入配置项
     * @param key
     * @param config
     */
    set(key, config) {
        const jsonConfig = this.get();
        let confH;
        if (typeof key === 'string') {
            if (config) {
                confH = config;
            }
            else {
                return false;
            }
        }
        else if (key) {
            confH = key;
        }
        else {
            return false;
        }
        let flg = false;
        try {
            let saveStr;
            let logMessage;
            if (typeof key === 'string') {
                saveStr = JSON.stringify(Object.assign({}, jsonConfig, { [key]: confH }), undefined, 2);
                logMessage = `Set settings <${this.name}> - <${key}> : `;
            }
            else {
                saveStr = JSON.stringify(Object.assign({}, jsonConfig, confH), undefined, 2);
                logMessage = `Set settings <${this.name}> : `;
            }
            fs.writeFileSync(this.filePath, saveStr, 'utf-8');
            log.info(logMessage, confH);
            flg = true;
        }
        catch (error) {
            log.error(error);
        }
        return flg;
    }
}
