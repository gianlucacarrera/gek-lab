import { cookies } from 'next/headers';

const SESSION_COOKIE = 'gek_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'gek-demo-secret-change-in-prod';

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
}

// Users with pre-hashed passwords (SHA-256 hex)
// admin: "changeme" → hash below
// test: "passwordcomplessa" → hash below
const USERS: Record<string, { passwordHash: string; user: User }> = {
  admin: {
    passwordHash: '057ba03d6c44104863dc7361fe4578965d1887360f90a0895882e58a6248fc86',
    user: { id: 'admin', name: 'Admin', role: 'admin' },
  },
  test: {
    passwordHash: '1164e03927d02f797025112e3612e32839f43e7cd1f1af16f0a081dcd5dac81c',
    user: { id: 'test', name: 'Gianluca', role: 'user' },
  },
};

// Compute SHA-256 hash of a string
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Sign a payload with HMAC-SHA256
async function sign(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const sigHex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `${payload}.${sigHex}`;
}

// Verify and extract payload from signed token
async function verify(token: string): Promise<string | null> {
  const dotIndex = token.lastIndexOf('.');
  if (dotIndex === -1) return null;

  const payload = token.substring(0, dotIndex);
  const expectedToken = await sign(payload);

  if (token === expectedToken) return payload;
  return null;
}

// Validate login credentials
export async function validateCredentials(
  username: string,
  password: string
): Promise<User | null> {
  const entry = USERS[username];
  if (!entry) return null;

  const hash = await hashPassword(password);
  if (hash !== entry.passwordHash) return null;

  return entry.user;
}

// Create a session cookie
export async function createSession(userId: string): Promise<string> {
  const payload = JSON.stringify({ userId, ts: Date.now() });
  return sign(payload);
}

// Get current user from session cookie (server-side)
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = await verify(token);
  if (!payload) return null;

  try {
    const { userId } = JSON.parse(payload);
    const entry = USERS[userId];
    return entry?.user ?? null;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE };
