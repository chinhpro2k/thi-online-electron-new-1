/**
 * 详细接口类型定义在: @/typescript/api-interface/*
 */
/**
 * 测试接口
 * @param params
 * @param options
 */
export function queryTestInfo(params, options) {
    return $api.request('/api-test/demo-test', params, options);
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function login(data) {
    return $api.request('/auth/login/electron', data, {
        method: 'POST',
    });
}
/**
 * 测试接口-返回错误
 * @param params
 * @param options
 */
export function queryTestInfoError(params, options) {
    return $api.request('/api-test/demo-test-error', params, options);
}
export function getDanhSachMonHoc(params, options) {
    return $api.request('/sotay/lop/mon-hoc/my', params, options);
}
export function getDanhSachLichThi(params, options) {
    return $api.request('/sotay/ngan-hang-de/sinh-vien/lich-thi', params, options);
}
export function getDeThi(maDotThi, options) {
    return $api.request(`/sotay/ngan-hang-de/sinh-vien/de-thi/${maDotThi}`, undefined, options);
}
export function nopBaiThi(data) {
    return $api.request('/sotay/ngan-hang-de/nop-bai-thi', data, {
        method: 'POST',
    });
}
export function postLogGiamSat(data) {
    console.log(`dataLOGggg`, data);
    debugger;
    return $api.request('/log-action/electron', data, {
        method: 'POST',
    });
}
export function uploadFile(data) {
    return $api.request('/upload-chung/general', data, {
        method: 'POST',
        formData: true,
    });
}
