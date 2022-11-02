import moment from 'moment';
export interface CauTraLoi {
  isKhac: boolean;
  luaChon: string;
}

export interface CauHoi {
  tepDinhKem: any;
  loaiCauHoi: string;
  noiDung: {
    cot: unknown[];
    hang: unknown[];
    isRequired: boolean;
    _id: string;
    loai: number; // 0: single choice
    cauHoi: string;
    cauTraLoi: CauTraLoi[];
    moTa?: string;
    image?: string;
    audio?: string;
    video?: string;
  };
  _id: string;
}

export interface DeThi {
  daLam: boolean;
  noiDungDe: CauHoi[];
}
export interface TrangThaiThi {
  idCaThi: string;
  dangThi: boolean;
  thoiGianBatDau: moment.MomentInput;
  thoiGianKetThuc: moment.MomentInput;
  deThi: DeThi;
  maLopThi: string;
  nganHangDeId: string;
}

export interface NoiDungTraLoi {
  cauHoi: string;
  cauHoiId: string;
  cauTraLoi: string[];
  maLopThi: string;
  loai: number;
}

export interface NopBaiThiData {
  maLopThi: string;
  nganHangDeId: string;
  noiDungTraLoi: NoiDungTraLoi[];
}

export enum LoaiCauHoi {
  ChonMotDapAn = 0,
  ChonNhieuDapAn = 1,
  ShortText = 2,
  Textarea = 3,
  DienOTrong = 5,
  KeoTha = 6,
  Audio = 7,
  File = 8,
  NgheDienTu = 9,
  HinhAnhNghe = 10,
}
