import { TrangThaiThi } from '@/src/views/app-thionline/typing';

export const initialState = {
  count: 1,
};

export function ACTION_ADD_COUNT(
  data: StoreDatas['ACTION_ADD_COUNT'],
  state: StoreStates,
  action: StoreAction<'ACTION_ADD_COUNT'>
): { count: StoreStates['count'] } {
  // console.log({ data, state, action });
  return { count: data };
}

export function ACTION_SAVE_USER(
  data: StoreDatas['ACTION_SAVE_USER'],
  state: StoreStates,
  action: StoreAction<'ACTION_SAVE_USER'>
): { user: StoreStates['user'] } {
  // console.log({ data, state, action });
  return { user: data };
}

export function ACTION_SAVE_TRANGTHAITHI(
  data: StoreDatas['ACTION_SAVE_TRANGTHAITHI'],
  state: StoreStates,
  action: StoreAction<'ACTION_SAVE_TRANGTHAITHI'>
): { trangThaiThi: StoreStates['trangThaiThi'] } {
  // console.log({ data, state, action });
  return { trangThaiThi: data };
}

export function ACTION_SAVE_LOGS(
  data: StoreDatas['ACTION_SAVE_LOGS'],
  state: StoreStates,
  action: StoreAction<'ACTION_SAVE_LOGS'>
): { logs: StoreStates['logs'] } {
  // console.log({ data, state, action });
  return { logs: data };
}

export function ACTION_SAVE_CLICK_COUNT(
  data: StoreDatas['ACTION_SAVE_CLICK_COUNT'],
  state: StoreStates,
  action: StoreAction<'ACTION_SAVE_CLICK_COUNT'>
): { clickCount: StoreStates['clickCount'] } {
  // console.log({ data, state, action });
  return { clickCount: data };
}

export function ACTION_SAVE_USB_LIST(
  data: StoreDatas['ACTION_SAVE_USB_LIST'],
  state: StoreStates,
  action: StoreAction<'ACTION_SAVE_USB_LIST'>
): { usbList: StoreStates['usbList'] } {
  // console.log({ data, state, action });
  return { usbList: data };
}

declare global {
  interface StoreStates {
    count: number;
    user: UserInfoNS.User | undefined;
    trangThaiThi: TrangThaiThi | undefined;
    logs: string[];
    usbList: string[];
    clickCount: number;
  }

  interface StoreDatas {
    ACTION_ADD_COUNT: StoreStates['count'];
    ACTION_SAVE_USER: StoreStates['user'];
    ACTION_SAVE_TRANGTHAITHI: StoreStates['trangThaiThi'];
    ACTION_SAVE_LOGS: StoreStates['logs'];
    ACTION_SAVE_CLICK_COUNT: StoreStates['clickCount'];
    ACTION_SAVE_USB_LIST: StoreStates['usbList'];
  }
}
