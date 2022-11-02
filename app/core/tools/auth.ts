let accessToken: string | undefined = undefined;

// declare interface UserObject {
//   anhDaiDien: string;
//   contactEmail: string;
//   createdAt: string;
//   diaChiHienNay: string;
//   gioiTinh: number;
//   hoDem: string;
//   hoTen: string;
//   id: string;
//   inactive: boolean;
//   khoa: string;
//   maKhoa: string;
//   maSv: string;
//   nganh: string;
//   ngaySinh: string;
//   ten: string;
//   vaiTro: number;
//   validated: boolean;
// }

let userObject: UserInfoNS.User;

export const getAccessToken = (): string | undefined => accessToken;

export const setAccessToken = (token: string): void => {
  accessToken = token;
};

export const getUserObject = (): UserInfoNS.User => userObject;

export const setUserObject = (object: UserInfoNS.User): void => {
  userObject = object;
};

export const removeAccessToken = (): void => {
  accessToken = undefined;
};
