/**
 * Client-side Rate Limiter
 * 
 * Provides throttling for sensitive operations:
 * - OTP requests (max 3 per 5 minutes)
 * - Transaction submissions (max 5 per minute)
 * - API calls (general throttling)
 * 
 * Note: This is a client-side complement to server-side rate limiting
 * (Firebase Security Rules). It prevents UI abuse but cannot replace
 * server-side enforcement.
 */

interface RateLimitConfig {
    maxAttempts: number;
    windowMs: number;
}

interface RateLimitEntry {
    attempts: number[];
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
    otp_request: { maxAttempts: 3, windowMs: 5 * 60 * 1000 }, // 3 per 5 min
    otp_verify: { maxAttempts: 5, windowMs: 5 * 60 * 1000 },  // 5 per 5 min
    transaction_submit: { maxAttempts: 5, windowMs: 60 * 1000 }, // 5 per min
    price_submit: { maxAttempts: 3, windowMs: 60 * 1000 },     // 3 per min
    general_api: { maxAttempts: 30, windowMs: 60 * 1000 },     // 30 per min
};

const store = new Map<string, RateLimitEntry>();

/**
 * Check if an action is rate limited.
 * Returns true if the action is allowed, false if rate limited.
 */
export function checkRateLimit(action: string): boolean {
    const config = RATE_LIMITS[action] || RATE_LIMITS.general_api;
    const now = Date.now();
    const key = action;

    let entry = store.get(key);
    if (!entry) {
        entry = { attempts: [] };
        store.set(key, entry);
    }

    // Remove expired attempts
    entry.attempts = entry.attempts.filter(t => now - t < config.windowMs);

    // Check if limit reached
    if (entry.attempts.length >= config.maxAttempts) {
        return false; // Rate limited
    }

    // Record this attempt
    entry.attempts.push(now);
    return true; // Allowed
}

/**
 * Get remaining attempts for an action.
 */
export function getRemainingAttempts(action: string): number {
    const config = RATE_LIMITS[action] || RATE_LIMITS.general_api;
    const now = Date.now();
    const entry = store.get(action);

    if (!entry) return config.maxAttempts;

    const validAttempts = entry.attempts.filter(t => now - t < config.windowMs);
    return Math.max(0, config.maxAttempts - validAttempts.length);
}

/**
 * Get time until rate limit resets (in ms).
 */
export function getResetTime(action: string): number {
    const config = RATE_LIMITS[action] || RATE_LIMITS.general_api;
    const entry = store.get(action);

    if (!entry || entry.attempts.length === 0) return 0;

    const oldest = Math.min(...entry.attempts);
    return Math.max(0, config.windowMs - (Date.now() - oldest));
}

/**
 * Reset rate limit for an action (use after successful verification).
 */
export function resetRateLimit(action: string): void {
    store.delete(action);
}
