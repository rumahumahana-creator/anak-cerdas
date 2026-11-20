import type { Handler } from '@netlify/functions';
import crypto from 'crypto';

function signToken(payload: object, secret: string): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  return `${data}.${signature}`;
}

function verifyToken(token: string, secret: string): boolean {
  try {
    const [data, signature] = token.split('.');
    if (!data || !signature) return false;
    const expected = crypto.createHmac('sha256', secret).update(data).digest('base64url');
    if (signature !== expected) return false;
    const parsed = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (!parsed.exp || Date.now() > parsed.exp) return false;
    return parsed.granted === true;
  } catch {
    return false;
  }
}

export const handler: Handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  };

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, message: 'Method not allowed' }),
    };
  }

  const expectedPassword = process.env.CATALOG_ACCESS_PASSWORD;
  const sessionSecret = process.env.CATALOG_SESSION_SECRET || 'anak-cerdas-fallback-signing-key-2026';

  if (!expectedPassword) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        ok: false,
        message: 'Konfigurasi server CATALOG_ACCESS_PASSWORD belum diatur di Netlify.',
      }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');

    if (body.action === 'verify-session' && typeof body.token === 'string') {
      const valid = verifyToken(body.token, sessionSecret);
      return {
        statusCode: valid ? 200 : 401,
        headers,
        body: JSON.stringify({ ok: valid }),
      };
    }

    const submittedPassword = typeof body.password === 'string' ? body.password.trim() : '';

    const a = Buffer.from(submittedPassword);
    const b = Buffer.from(expectedPassword);
    const isMatch = a.length === b.length && crypto.timingSafeEqual(a, b);

    if (!isMatch) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          ok: false,
          message: 'Kata sandi katalog tidak sesuai. Silakan periksa kembali.',
        }),
      };
    }

    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const token = signToken({ granted: true, exp: expiresAt }, sessionSecret);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        token,
        expiresAt,
      }),
    };
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ ok: false, message: 'Permintaan tidak valid.' }),
    };
  }
};
