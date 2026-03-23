import type { UserInfo } from '@vben/types';

// Current single-owner auth baseline: centralized mock provider, formalized by repo standard.
const MOCK_ACCESS_TOKEN = 'black-tonny-mock-access-token';
const MOCK_ACCESS_CODES = ['black-tonny'];

const MOCK_USER_INFO: UserInfo = {
  avatar: 'https://avatar.vercel.sh/black-tonny-owner.svg?text=BT',
  desc: 'Black Tonny 店主账号（mock）',
  homePath: '/dashboard',
  realName: '老板',
  roles: ['owner'],
  token: MOCK_ACCESS_TOKEN,
  userId: 'black-tonny-owner',
  username: 'owner',
};

export async function getMockAccessCodes() {
  return [...MOCK_ACCESS_CODES];
}

export async function getMockLoginResult() {
  return {
    accessToken: MOCK_ACCESS_TOKEN,
  };
}

export async function getMockLogoutResult() {
  return {
    success: true,
  };
}

export async function getMockRefreshTokenResult() {
  return {
    data: MOCK_ACCESS_TOKEN,
    status: 200,
  };
}

export async function getMockUserInfo(): Promise<UserInfo> {
  return {
    ...MOCK_USER_INFO,
  };
}
