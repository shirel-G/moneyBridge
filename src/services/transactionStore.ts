/**
 * Firebase-backed transaction store for real-time cross-device communication.
 * Replaces the previous in-memory store.
 */

import { database } from './firebaseConfig';
import {
    ref,
    set,
    get,
    update,
    push,
    onValue,
    query,
    orderByChild,
    equalTo,
    type Unsubscribe,
} from 'firebase/database';
import type { VehicleDetails } from './mockServices';

export interface SellerProfile {
    phone: string;
    idNumber: string;
    registeredAt: number;
}

export interface TransactionRequest {
    id: string;
    buyerPhone: string;
    buyerName: string;
    sellerPhone: string;
    sellerIdNumber: string;
    vehicle: VehicleDetails;
    pricing: { minPrice: number; maxPrice: number; avgPrice: number };
    ownerCount: number;
    mileage: number;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: number;
}

// --- Seller Registration ---

export async function registerSeller(phone: string, idNumber: string): Promise<SellerProfile> {
    const key = `${phone}_${idNumber}`;
    const profile: SellerProfile = { phone, idNumber, registeredAt: Date.now() };
    await set(ref(database, `sellers/${key}`), profile);
    return profile;
}

export async function isSellerRegistered(phone: string, idNumber: string): Promise<boolean> {
    const key = `${phone}_${idNumber}`;
    const snapshot = await get(ref(database, `sellers/${key}`));
    return snapshot.exists();
}

// --- Transaction Requests ---

export async function createRequest(
    req: Omit<TransactionRequest, 'id' | 'status' | 'createdAt'>
): Promise<TransactionRequest> {
    const requestsRef = ref(database, 'requests');
    const newRef = push(requestsRef);
    const request: TransactionRequest = {
        ...req,
        id: newRef.key!,
        status: 'pending',
        createdAt: Date.now(),
    };
    await set(newRef, request);
    return request;
}

export async function approveRequest(id: string): Promise<void> {
    await update(ref(database, `requests/${id}`), { status: 'approved' });
}

export async function rejectRequest(id: string): Promise<void> {
    await update(ref(database, `requests/${id}`), { status: 'rejected' });
}

// --- Real-Time Listeners ---

/**
 * Subscribe to a single request by ID. Returns unsubscribe function.
 */
export function subscribeToRequest(
    requestId: string,
    callback: (request: TransactionRequest | null) => void
): Unsubscribe {
    const requestRef = ref(database, `requests/${requestId}`);
    return onValue(requestRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val() as TransactionRequest);
        } else {
            callback(null);
        }
    });
}

/**
 * Subscribe to all requests for a specific seller (by phone + ID).
 * Uses a composite index field for querying.
 */
export function subscribeToSellerRequests(
    sellerPhone: string,
    sellerIdNumber: string,
    callback: (requests: TransactionRequest[]) => void
): Unsubscribe {
    // We query by sellerPhone and then filter by sellerIdNumber client-side
    // because Firebase RTDB only supports single-field queries.
    const requestsRef = query(
        ref(database, 'requests'),
        orderByChild('sellerPhone'),
        equalTo(sellerPhone)
    );

    return onValue(requestsRef, (snapshot) => {
        const requests: TransactionRequest[] = [];
        if (snapshot.exists()) {
            snapshot.forEach((child) => {
                const req = child.val() as TransactionRequest;
                if (req.sellerIdNumber === sellerIdNumber) {
                    requests.push(req);
                }
            });
        }
        callback(requests);
    });
}
