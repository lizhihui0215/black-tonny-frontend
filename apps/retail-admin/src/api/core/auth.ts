import {
  getMockAccessCodes,
  getMockLoginResult,
  getMockLogoutResult,
  getMockRefreshTokenResult,
} from './mock-auth';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  void data;
  return getMockLoginResult();
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return getMockRefreshTokenResult();
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return getMockLogoutResult();
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return getMockAccessCodes();
}
