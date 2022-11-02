import { __awaiter } from "tslib";
import axios from 'axios';
import path from 'path';
import { errorAction } from './handle-response';
// import FormData from 'form-data';
// axios 跨域请求携带 cookie
axios.defaults.withCredentials = true;
const DEFAULT_CONFIG = {
    method: 'POST',
    host: process.env.API_HOST,
    protocol: process.env.API_PROTOCOL,
    baseUrl: process.env.API_BASE_PATH,
    timeout: 30000,
    loading: false,
    errorType: 'notification',
    checkStatus: true,
    headers: {
        'Content-Type': 'application/json',
    },
};
// 默认传递的参数
const DEFAULT_PARAMS = {
// TODO 每一个请求传递的默认参数, 这在某些需要手动传递 token 的场景下很管用
};
/**
 * 发起一个请求
 * @param apiPath
 * @param params
 * @param optionsSource
 */
export function request(apiPath, params, optionsSource) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = Object.assign({}, DEFAULT_CONFIG, optionsSource);
        const { method, protocol, host, baseUrl, headers, responseType, checkStatus, formData, } = options;
        const sendData = {
            url: `${protocol}${path.join(host || '', baseUrl || '', apiPath || '')}`,
            method,
            headers: Object.assign(Object.assign({}, headers), { Authorization: `Bearer ${$tools.getAccessToken()}` }),
            responseType,
        };
        const paramsData = Object.assign({}, DEFAULT_PARAMS, params);
        console.log('params', params);
        if (method === 'GET') {
            sendData.params = params;
        }
        else if (formData) {
            const formData = new FormData();
            Object.keys(paramsData).forEach((key) => {
                formData.append(key, paramsData[key]);
            });
            sendData.data = formData;
        }
        else {
            sendData.data = paramsData;
        }
        return axios(sendData)
            .then((res) => {
            const data = res.data;
            // TODO 根据后端接口设定成功条件, 例如此处 `data.code == 200`
            if (!checkStatus ||
                data.statusCode == 200 ||
                data.statusCode == 201 ||
                (data === null || data === void 0 ? void 0 : data.user) ||
                (data === null || data === void 0 ? void 0 : data.data)) {
                return data;
            }
            else {
                console.log('loi here');
                return Promise.reject(data);
            }
        })
            .catch((err) => __awaiter(this, void 0, void 0, function* () {
            yield errorAction(err, sendData, options);
            console.log('loi here 2');
            return Promise.reject(Object.assign(Object.assign({}, err), { path: apiPath, sendData, resData: err }));
        }));
    });
}
