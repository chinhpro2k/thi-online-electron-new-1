import { __awaiter } from "tslib";
import * as tools from './tools';
import { store } from './store';
import * as api from './api';
export function initMain() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            global.__$tools = tools;
            global.__$api = api;
            global.__$store = store;
            resolve();
        }));
    });
}
