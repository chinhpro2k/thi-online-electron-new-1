declare namespace queryTestInfoUsingGET {
  interface Params {}

  interface Response {
    code: number;
    status: boolean;
    data: {
      info: string;
    };
  }
}

declare namespace queryGet {
  interface Params {
    page: number;
    limit: number;
    cond: {
      [x: string]: unknown;
    };
    [x: string]: unknown;
  }
  interface Response {
    data: any;
    message: string;
    statusCode: number;
  }
}

declare namespace UserInfoNS {
  export interface SystemInfo {
    indentityValidate: boolean;
    emailValidate: boolean;
    thirdPartyAuth: boolean;
  }

  export interface NotifLichHoc {
    isReceiverNotifLichHoc: boolean;
  }

  export interface NotifChung {
    isReceiverNotifChung: boolean;
  }

  export interface UserNotifSetting {
    notifLichHoc: NotifLichHoc;
    notifChung: NotifChung;
  }

  export interface LastRequest {
    resetPassword: Date;
  }

  export interface User {
    systemInfo: SystemInfo;
    userNotifSetting: UserNotifSetting;
    lastRequest: LastRequest;
    inactive: boolean;
    contactEmail: any[];
    _id: string;
    ngaySinh: Date;
    maKhoa: string;
    hoDem: string;
    gioiTinh: number;
    vaiTro: number;
    diaChiHienNay: string;
    username: string;
    hoTen: string;
    maSv: string;
    ten: string;
    anhDaiDien: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    validated: boolean;
    lastTimeLogin: Date;
    password: string;
    urlElectronImg: string;
    khoa?: any;
    nganh?: any;
    id: string;
    partnerId: Array<Record<string, any>>;
    maDinhDanh: string;
  }

  export interface RootObject {
    user: User;
    accessToken: string;
  }
}
