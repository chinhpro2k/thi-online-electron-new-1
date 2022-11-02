/**
 * 详细接口类型定义在: @/typescript/api-interface/*
 */

import { NopBaiThiData } from '@/src/views/app-thionline/typing';
import axios from 'axios';
import qs from 'qs';
/**
 * 测试接口
 * @param params
 * @param options
 */
export function queryTestInfo(
  params?: queryTestInfoUsingGET.Params,
  options?: RequestOptions
): Promise<queryTestInfoUsingGET.Response> {
  return $api.request('/api-test/demo-test', params, options);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function login(data: { username: string; password: string }) {
  return $api.request('/auth/login/electron', data, {
    method: 'POST',
  });
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function loginKeycloak(data: {
  accessToken: string;
  clientPlatform: string;
}) {
  return $api.request('/auth/login/keycloak', data, {
    method: 'POST',
  });
}
export function logoutKeycloak() {
  return $api.request('/odoo-auth/logout', undefined, {
    method: 'POST',
  });
}
export function getToken(data: {
  grant_type: string;
  code: string;
  client_id: string;
  redirect_uri: string;
}) {
  return axios.post(
    'https://slinkid.ptit.edu.vn/auth/realms/master/protocol/openid-connect/token',
    qs.stringify(data),
    {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    }
  );
}
/**
 * 测试接口-返回错误
 * @param params
 * @param options
 */
export function queryTestInfoError(
  params?: queryTestInfoUsingGET.Params,
  options?: RequestOptions
): Promise<queryTestInfoUsingGET.Response> {
  return $api.request('/api-test/demo-test-error', params, options);
}

export function getDanhSachMonHoc(
  params: queryGet.Params & { maKyHoc: string },
  options?: RequestOptions
): Promise<queryGet.Response> {
  return $api.request('/odoo-slide-channel/pageable', params, options);
}
export function getDanhSachCaThi(
  params: { condition: { maKyHoc: string } },
  options?: RequestOptions
): Promise<queryGet.Response> {
  return $api.request(
    '/thi-online/ngan-hang-de/sinh-vien/all-ca-thi',
    params,
    options
  );
}

export function getDanhSachKyHoc(
  params: { idHinhThuc: string | undefined },
  options?: RequestOptions
): Promise<queryGet.Response> {
  return $api.request('/odoo-ky-hoc/sinh-vien/me', params, options);
}

export function getDanhSachLichThi(
  params: queryGet.Params & { maKyHoc: string; maMonHoc: string },
  options?: RequestOptions
): Promise<queryGet.Response> {
  return $api.request(
    `/thi-online/ngan-hang-de/sinh-vien/lich-thi?maMonHoc=${params.maMonHoc}&maKyHoc=${params.maKyHoc}`,
    undefined,
    options
  );
}

export function getDeThi(
  idLichThi: string,
  options?: RequestOptions
): Promise<queryGet.Response> {
  return $api.request(
    `/thi-online/ngan-hang-de/sinh-vien/de-thi/${idLichThi}`,
    undefined,
    options
  );
}

export function nopBaiThi(data: NopBaiThiData): Promise<queryGet.Response> {
  return $api.request('/thi-online/ngan-hang-de/nop-bai-thi', data, {
    method: 'POST',
  });
}

export function postLogGiamSat(data: {
  idCaThi: string;
  log: string[];
}): Promise<queryGet.Response> {
  console.log(`dataLOGggg`, data);
  debugger;
  return $api.request('/log-action/electron', data, {
    method: 'POST',
  });
}

export function uploadFile(data: FormData): Promise<queryGet.Response> {
  return $api.request('/upload-chung/general', data, {
    method: 'POST',
    formData: true,
  });
}
