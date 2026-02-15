/**
 * Application-level encryption for sensitive fields (ID numbers, bank accounts, phone numbers).
 * Uses Web Crypto API with AES-GCM 256-bit encryption.
 * 
 * IMPORTANT: In production, the encryption key should be managed via a secure
 * Key Management Service (KMS), NOT hardcoded. This implementation uses a
 * derived key from an environment variable as a starting point.
 */

// Derive a consistent 256-bit key from a passphrase using PBKDF2
const ENCRYPTION_SALT = new Uint8Array([77, 111, 110, 101, 121, 66, 114, 105, 100, 103, 101, 50, 48, 50, 54, 33]); // "MoneyBridge2026!"

async function getEncryptionKey(): Promise<CryptoKey> {
    // In production, this should come from a secure KMS or environment variable
    // For now, we use a static passphrase — this MUST be changed before production
    const passphrase = 'MB-ESCROW-AES256-KEY-v1-CHANGE-IN-PROD';
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(passphrase),
        'PBKDF2',
        false,
        ['deriveKey']
    );

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: ENCRYPTION_SALT,
            iterations: 100000,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Returns a base64-encoded string containing the IV + ciphertext.
 */
export async function encryptField(plaintext: string): Promise<string> {
    if (!plaintext) return '';

    const key = await getEncryptionKey();
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM

    const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(plaintext)
    );

    // Combine IV + ciphertext into a single array
    const combined = new Uint8Array(iv.length + new Uint8Array(ciphertext).length);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    // Return as base64
    return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt a base64-encoded AES-256-GCM encrypted string.
 * Expects the format: base64(IV + ciphertext).
 */
export async function decryptField(encryptedBase64: string): Promise<string> {
    if (!encryptedBase64) return '';

    const key = await getEncryptionKey();

    // Decode base64
    const combined = new Uint8Array(
        atob(encryptedBase64).split('').map(c => c.charCodeAt(0))
    );

    // Extract IV (first 12 bytes) and ciphertext
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertext
    );

    return new TextDecoder().decode(decrypted);
}

/**
 * Mask a sensitive field for display purposes.
 * Shows only the last N characters.
 */
export function maskField(value: string, showLast: number = 4): string {
    if (!value || value.length <= showLast) return value;
    const masked = '*'.repeat(value.length - showLast);
    return masked + value.slice(-showLast);
}

/**
 * Hash a value for lookup purposes (e.g., finding a seller by phone hash).
 * Uses SHA-256; not reversible.
 */
export async function hashField(value: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(value + ':moneybridge-salt');
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
