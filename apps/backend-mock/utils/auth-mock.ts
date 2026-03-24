import jwt from 'jsonwebtoken';

export const AUTH_MOCK_API_PATHS = {
  accessCodes: '/api/auth/codes',
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  refresh: '/api/auth/refresh',
  userInfo: '/api/user/info',
} as const;

function readMockStringEnv(name: string, fallback: string) {
  const value = process.env[name];
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function readMockPositiveIntEnv(name: string, fallback: number) {
  const value = process.env[name];
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export const MOCK_OWNER_USERNAME = readMockStringEnv(
  'OWNER_LOGIN_USERNAME',
  'owner',
);
export const MOCK_OWNER_PASSWORD = readMockStringEnv(
  'OWNER_LOGIN_PASSWORD',
  '123456',
);
export const MOCK_OWNER_ACCESS_CODES = ['black-tonny'];

const ACCESS_TOKEN_SECRET = readMockStringEnv(
  'FRONTEND_AUTH_SECRET',
  'black-tonny-frontend-auth-secret',
);
const ACCESS_TOKEN_TTL_SECONDS = readMockPositiveIntEnv(
  'FRONTEND_AUTH_ACCESS_TOKEN_TTL_SECONDS',
  604800,
);

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
  avatar: readMockStringEnv(
    'OWNER_LOGIN_AVATAR_URL',
    'https://avatar.vercel.sh/black-tonny.svg?text=BT',
  ),
  desc: 'Black Tonny 店主账号',
  homePath: readMockStringEnv('OWNER_LOGIN_HOME_PATH', '/dashboard'),
  realName: readMockStringEnv('OWNER_LOGIN_REAL_NAME', '老板'),
  roles: ['owner'],
  userId: 'black-tonny-owner',
  username: MOCK_OWNER_USERNAME,
};

interface MockFrontendUserInfo extends MockOwnerPayload {
  token: string;
}

interface MockFrontendUserError {
  code: 40_101;
  message: string;
  ok: false;
}

interface MockFrontendUserSuccess {
  ok: true;
  userInfo: MockFrontendUserInfo;
}

export type MockFrontendUserResult =
  | MockFrontendUserError
  | MockFrontendUserSuccess;

function extractBearerToken(authHeader?: null | string) {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const [, token] = authHeader.split(' ');
  return token || null;
}

export function createMockAccessToken() {
  return jwt.sign(MOCK_OWNER_PROFILE, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
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

export function requireMockFrontendUser(
  authHeader?: null | string,
): MockFrontendUserResult {
  if (!authHeader) {
    return {
      code: 40_101,
      message: 'Frontend access token is required.',
      ok: false,
    };
  }

  if (!authHeader.startsWith('Bearer ')) {
    return {
      code: 40_101,
      message: 'Unsupported authorization scheme.',
      ok: false,
    };
  }

  const token = extractBearerToken(authHeader);
  if (!token) {
    return {
      code: 40_101,
      message: 'Frontend access token is required.',
      ok: false,
    };
  }

  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as MockOwnerPayload;

    return {
      ok: true,
      userInfo: {
        ...MOCK_OWNER_PROFILE,
        roles: [...payload.roles],
        token,
      },
    };
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'name' in error &&
      error.name === 'TokenExpiredError'
    ) {
      return {
        code: 40_101,
        message: 'Frontend access token has expired.',
        ok: false,
      };
    }

    return {
      code: 40_101,
      message: 'Invalid frontend access token.',
      ok: false,
    };
  }
}

export function verifyMockAccessToken(authHeader?: null | string) {
  const result = requireMockFrontendUser(authHeader);
  return result.ok ? result.userInfo : null;
}
