/**
 * Audit Log Service — Immutable action log for compliance.
 * 
 * Records all significant user actions with:
 * - Timestamp
 * - Action type
 * - Actor (phone hash, role)
 * - Details (non-sensitive)
 * - Request ID (if applicable)
 * 
 * Data is written to a separate Firebase path (/audit_logs)
 * and should be protected by rules that allow write-only (no delete/update).
 */

import { ref, push, serverTimestamp } from 'firebase/database';
import { database } from './firebaseConfig';

export type AuditAction =
    | 'CONSENT_GRANTED'
    | 'CONSENT_REVOKED'
    | 'ROLE_SELECTED'
    | 'VEHICLE_LOOKUP'
    | 'SELLER_REGISTERED'
    | 'REQUEST_CREATED'
    | 'REQUEST_APPROVED'
    | 'REQUEST_REJECTED'
    | 'PRICE_SET'
    | 'PRICE_CONFIRMED'
    | 'PRICE_REJECTED'
    | 'BANK_DETAILS_SUBMITTED'
    | 'PAYMENT_INITIATED'
    | 'PAYMENT_COMPLETED'
    | 'TRANSFER_INITIATED'
    | 'TRANSFER_COMPLETED'
    | 'TRANSACTION_CANCELLED'
    | 'DATA_ACCESS_REQUESTED'
    | 'DATA_DELETION_REQUESTED'
    | 'ERROR_OCCURRED';

interface AuditEntry {
    action: AuditAction;
    timestamp: object; // Firebase serverTimestamp
    actor: {
        role: 'buyer' | 'seller' | 'system';
        phoneHash?: string; // Hashed phone for lookup without exposing PII
    };
    requestId?: string;
    details?: Record<string, string | number | boolean>;
    ipHint?: string; // Partial IP for fraud detection (first 2 octets only)
    userAgent?: string;
}

/**
 * Write an audit log entry to Firebase.
 * This is append-only — entries cannot be modified or deleted.
 */
export async function writeAuditLog(
    action: AuditAction,
    actor: { role: 'buyer' | 'seller' | 'system'; phoneHash?: string },
    details?: Record<string, string | number | boolean>,
    requestId?: string
): Promise<void> {
    try {
        const auditRef = ref(database, 'audit_logs');
        const entry: AuditEntry = {
            action,
            timestamp: serverTimestamp(),
            actor,
            ...(requestId && { requestId }),
            ...(details && { details }),
            userAgent: typeof navigator !== 'undefined'
                ? navigator.userAgent.substring(0, 100) // Truncate for privacy
                : undefined,
        };
        await push(auditRef, entry);
    } catch (error) {
        // Audit logging should never block the main flow
        console.error('[AuditLog] Failed to write entry:', action, error);
    }
}

/**
 * Convenience function to log transaction-related actions.
 */
export async function logTransactionAction(
    action: AuditAction,
    role: 'buyer' | 'seller',
    requestId: string,
    details?: Record<string, string | number | boolean>
): Promise<void> {
    return writeAuditLog(action, { role }, details, requestId);
}

/**
 * Log consent-related actions (GDPR/PPL compliance).
 */
export async function logConsent(
    granted: boolean,
    consentTypes: string[],
    phoneHash?: string
): Promise<void> {
    return writeAuditLog(
        granted ? 'CONSENT_GRANTED' : 'CONSENT_REVOKED',
        { role: 'buyer', phoneHash },
        {
            consentTypes: consentTypes.join(','),
            version: '1.0',
            timestamp: new Date().toISOString()
        }
    );
}
