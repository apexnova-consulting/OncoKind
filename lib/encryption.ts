/**
 * AES-256-GCM encryption for sensitive JSON at rest.
 * Key from process.env.ENCRYPTION_KEY (32 bytes hex or base64).
 * NEVER log decrypted content—PHI-safe logging only.
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY env var required for patient data encryption');
  }

  const decoded = Buffer.from(key, 'base64');
  if (decoded.length !== KEY_LENGTH) {
    throw new Error('ENCRYPTION_KEY must be 32 bytes, base64-encoded');
  }
  return decoded;
}

/**
 * Encrypt JSON-serializable object to BYTEA for Supabase storage.
 */
export function encryptJson(payload: unknown): Buffer {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });

  const plaintext = JSON.stringify(payload);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]);
}

/**
 * Format encrypted buffer for Supabase bytea column.
 * Supabase/PostgREST expects hex-encoded bytea: \x + hex string.
 */
export function toSupabaseBytea(buffer: Buffer): string {
  return '\\x' + buffer.toString('hex');
}

/**
 * Decrypt BYTEA from Supabase back to object.
 * Accepts Buffer, Uint8Array, or hex string (with or without \\x prefix).
 */
export function decryptJson<T = unknown>(encrypted: Buffer | Uint8Array | string): T {
  const key = getEncryptionKey();
  let buf: Buffer;
  if (typeof encrypted === 'string') {
    const hex = encrypted.startsWith('\\x') ? encrypted.slice(2) : encrypted;
    buf = Buffer.from(hex, 'hex');
  } else {
    buf = Buffer.isBuffer(encrypted) ? encrypted : Buffer.from(encrypted);
  }

  if (buf.length < IV_LENGTH + AUTH_TAG_LENGTH) {
    throw new Error('Invalid encrypted payload');
  }

  const iv = buf.subarray(0, IV_LENGTH);
  const authTag = buf.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = buf.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);

  const plaintext = decipher.update(ciphertext) + decipher.final('utf8');
  return JSON.parse(plaintext) as T;
}
