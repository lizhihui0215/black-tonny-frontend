import jwt from 'jsonwebtoken';

export const AUTH_MOCK_API_PATHS = {
  accessCodes: '/api/auth/codes',
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  refresh: '/api/auth/refresh',
  userInfo: '/api/user/info',
} as const;

export const MOCK_OWNER_USERNAME = 'owner';
export const MOCK_OWNER_PASSWORD = 'black-tonny';
export const MOCK_OWNER_ACCESS_CODES = ['black-tonny'];

const ACCESS_TOKEN_SECRET = 'black-tonny-backend-mock-access-token';

interface MockOwnerPayload {
  avatar: string;
  desc: string;
  homePath: string;
  realName: string;
  roles: string[];
  userId: string;
  username: string;
}

const MOCK_OWNER_PROFILE: MockOwnerPayload = {
  avatar: 'https://avatar.vercel.sh/black-tonny-owner.svg?text=BT',
  desc: 'Black Tonny 店主账号（backend-mock）',
  homePath: '/dashboard',
  realName: '老板',
  roles: ['owner'],
  userId: 'black-tonny-owner',
  username: MOCK_OWNER_USERNAME,
};

function extractBearerToken(authHeader?: null | string) {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const [, token] = authHeader.split(' ');
  return token || null;
}

export function createMockAccessToken() {
  return jwt.sign(MOCK_OWNER_PROFILE, ACCESS_TOKEN_SECRET, {
    expiresIn: '7d',
  });
}

export function createMockLoginResult(payload: {
  password?: string;
  username?: string;
}) {
  if (
    payload.username !== MOCK_OWNER_USERNAME ||
    payload.password !== MOCK_OWNER_PASSWORD
  ) {
    return null;
  }

  return {
    accessToken: createMockAccessToken(),
  };
}

export function createMockLogoutResult() {
  return {
    success: true,
  };
}

export function createMockRefreshTokenResult() {
  return createMockAccessToken();
}

export function getMockAccessCodes() {
  return [...MOCK_OWNER_ACCESS_CODES];
}

export function verifyMockAccessToken(authHeader?: null | string) {
  const token = extractBearerToken(authHeader);
  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as MockOwnerPayload;

    return {
      ...MOCK_OWNER_PROFILE,
      roles: [...payload.roles],
      token,
    };
  } catch {
    return null;
  }
}
