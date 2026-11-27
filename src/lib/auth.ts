// ==============================================================================
// MWALIMU FAMILY - PRODUCTION CRYPTOGRAPHIC AUTHENTICATION
// Secure, server-side HMAC-signed admin session verification
// ==============================================================================

export const ADMIN_COOKIE_NAME = 'mf_admin_session';

/**
 * Returns the configured admin secret key.
 * Strictly uses server-side environment variables to prevent client exposure.
 */
export function getAdminSecretKey(): string {
  return (process.env.ADMIN_SECRET_KEY || '').trim();
}

/**
 * Validates a user-provided password against the server-configured ADMIN_SECRET_KEY
 * using constant-time comparison. Fails closed if ADMIN_SECRET_KEY is not set.
 */
export function verifyAdminPassword(candidate: string): boolean {
  if (!candidate || typeof candidate !== 'string') return false;
  const secret = getAdminSecretKey();
  if (!secret) return false;

  const trimmedCandidate = candidate.trim();
  if (trimmedCandidate.length !== secret.length) return false;

  let mismatch = 0;
  for (let i = 0; i < trimmedCandidate.length; i++) {
    mismatch |= trimmedCandidate.charCodeAt(i) ^ secret.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Generates a cryptographic PBKDF2-SHA256 salted password hash (Edge + Node safe).
 */
export async function hashAdminPassword(password: string): Promise<{ salt: string; hash: string }> {
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return {
    salt: Buffer.from(saltBytes).toString('base64url'),
    hash: Buffer.from(bits).toString('base64url'),
  };
}

/**
 * Constant-time verification of a password against stored PBKDF2-SHA256 salt + hash.
 */
export async function verifyAdminPasswordHash(
  candidate: string,
  saltBase64: string,
  expectedHashBase64: string
): Promise<boolean> {
  if (!candidate || !saltBase64 || !expectedHashBase64) return false;
  try {
    const saltBytes = Uint8Array.from(Buffer.from(saltBase64, 'base64url'));
    const expectedBytes = Uint8Array.from(Buffer.from(expectedHashBase64, 'base64url'));
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(candidate),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt: saltBytes, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      256
    );
    const derivedBytes = new Uint8Array(bits);
    if (derivedBytes.length !== expectedBytes.length) return false;
    let mismatch = 0;
    for (let i = 0; i < derivedBytes.length; i++) {
      mismatch |= derivedBytes[i] ^ expectedBytes[i];
    }
    return mismatch === 0;
  } catch {
    return false;
  }
}

/**
 * Creates an HMAC-SHA256 signed admin session token.
 * Supports optional admin email encoded in payload.
 */
export async function createAdminSessionToken(durationSeconds = 86400, email?: string): Promise<string> {
  const secret = getAdminSecretKey();
  if (!secret) {
    throw new Error('ADMIN_SECRET_KEY is not configured');
  }
  const expiresAt = Date.now() + durationSeconds * 1000;
  const emailTag = email ? Buffer.from(email.trim().toLowerCase(), 'utf8').toString('base64url') : '';
  const payload = emailTag ? `mf_admin_acct:${emailTag}:${expiresAt}` : `mf_admin:${expiresAt}`;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    encoder.encode(payload)
  );

  const signatureBase64 = Buffer.from(signatureBuffer).toString('base64url');
  return `${payload}:${signatureBase64}`;
}

/**
 * Parses and verifies an HMAC-SHA256 signed admin session token.
 */
export async function extractAdminSession(
  token: string | undefined | null
): Promise<{ valid: boolean; email?: string }> {
  if (!token || typeof token !== 'string') return { valid: false };

  const parts = token.split(':');
  let prefix = '';
  let email: string | undefined;
  let expStr = '';
  let signatureBase64 = '';
  let payload = '';

  if (parts.length === 3 && parts[0] === 'mf_admin') {
    [prefix, expStr, signatureBase64] = parts;
    payload = `${prefix}:${expStr}`;
  } else if (parts.length === 4 && parts[0] === 'mf_admin_acct') {
    prefix = parts[0];
    try {
      email = Buffer.from(parts[1], 'base64url').toString('utf8');
    } catch {
      return { valid: false };
    }
    expStr = parts[2];
    signatureBase64 = parts[3];
    payload = `${prefix}:${parts[1]}:${expStr}`;
  } else {
    return { valid: false };
  }

  const expiresAt = parseInt(expStr, 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    return { valid: false };
  }

  try {
    const secret = getAdminSecretKey();
    if (!secret) return { valid: false };
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signatureBytes = Buffer.from(signatureBase64, 'base64url');
    const valid = await crypto.subtle.verify(
      'HMAC',
      cryptoKey,
      signatureBytes,
      encoder.encode(payload)
    );
    return valid ? { valid: true, email } : { valid: false };
  } catch {
    return { valid: false };
  }
}

/**
 * Verifies an HMAC-SHA256 signed admin session token.
 * Confirms integrity and expiration timestamp.
 */
export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  const res = await extractAdminSession(token);
  return res.valid;
}

/**
 * Extracts and verifies admin authentication from an incoming Next.js Request.
 * Inspects both HTTP-only cookies and Authorization Bearer headers.
 */
export async function verifyRequestAdmin(req: { cookies: { get: (name: string) => { value: string } | undefined }; headers: { get: (name: string) => string | null } }): Promise<boolean> {
  const cookieToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const authHeader = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const token = cookieToken || authHeader;
  return verifyAdminSessionToken(token);
}

