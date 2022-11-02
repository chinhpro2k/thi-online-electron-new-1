let accessToken = undefined;
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
let userObject;
export const getAccessToken = () => accessToken;
export const setAccessToken = (token) => {
    accessToken = token;
};
export const getUserObject = () => userObject;
export const setUserObject = (object) => {
    userObject = object;
};
export const removeAccessToken = () => {
    accessToken = undefined;
};
