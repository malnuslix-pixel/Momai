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
  const secret = process.env.ADMIN_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) {
    throw new Error('ADMIN_SECRET_KEY is not configured in the server environment.');
  }
  return secret.trim();
}

/**
 * Validates a user-provided password against the server-configured admin secret.
 * Constant-time comparison prevents timing attacks.
 */
export function verifyAdminPassword(candidate: string): boolean {
  if (!candidate || typeof candidate !== 'string') return false;
  try {
    const validSecret = getAdminSecretKey();
    if (candidate.length !== validSecret.length) return false;
    
    // Constant-time character comparison
    let mismatch = 0;
    for (let i = 0; i < candidate.length; i++) {
      mismatch |= candidate.charCodeAt(i) ^ validSecret.charCodeAt(i);
    }
    return mismatch === 0;
  } catch {
    return false;
  }
}

/**
 * Creates an HMAC-SHA256 signed admin session token.
 * Payload structure: admin:expiry_timestamp:signature
 */
export async function createAdminSessionToken(durationSeconds = 86400): Promise<string> {
  const secret = getAdminSecretKey();
  const expiresAt = Date.now() + durationSeconds * 1000;
  const payload = `mf_admin:${expiresAt}`;
  
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
 * Verifies an HMAC-SHA256 signed admin session token.
 * Confirms integrity and expiration timestamp.
 */
export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split(':');
  if (parts.length !== 3) return false;

  const [prefix, expStr, signatureBase64] = parts;
  if (prefix !== 'mf_admin') return false;

  const expiresAt = parseInt(expStr, 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    return false; // Token expired
  }

  try {
    const secret = getAdminSecretKey();
    const payload = `${prefix}:${expStr}`;
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
    return await crypto.subtle.verify(
      'HMAC',
      cryptoKey,
      signatureBytes,
      encoder.encode(payload)
    );
  } catch {
    return false;
  }
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

