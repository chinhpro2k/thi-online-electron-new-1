export const initialState = {
    count: 1,
};
export function ACTION_ADD_COUNT(data, state, action) {
    // console.log({ data, state, action });
    return { count: data };
}
export function ACTION_SAVE_USER(data, state, action) {
    // console.log({ data, state, action });
    return { user: data };
}
export function ACTION_SAVE_TRANGTHAITHI(data, state, action) {
    // console.log({ data, state, action });
    return { trangThaiThi: data };
}
export function ACTION_SAVE_LOGS(data, state, action) {
    // console.log({ data, state, action });
    return { logs: data };
}
export function ACTION_SAVE_CLICK_COUNT(data, state, action) {
    // console.log({ data, state, action });
    return { clickCount: data };
}
export function ACTION_SAVE_USB_LIST(data, state, action) {
    // console.log({ data, state, action });
    return { usbList: data };
}
