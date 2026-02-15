/**
 * Firebase-backed transaction store for real-time cross-device communication.
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
    status: 'pending' | 'approved' | 'price_set' | 'price_confirmed' | 'paid' | 'transferred' | 'completed' | 'rejected';
    agreedPrice: number | null;
    paymentComplete: boolean;
    transferComplete: boolean;
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
    req: Omit<TransactionRequest, 'id' | 'status' | 'createdAt' | 'agreedPrice' | 'paymentComplete' | 'transferComplete'>
): Promise<TransactionRequest> {
    const requestsRef = ref(database, 'requests');
    const newRef = push(requestsRef);
    const request: TransactionRequest = {
        ...req,
        id: newRef.key!,
        status: 'pending',
        agreedPrice: null,
        paymentComplete: false,
        transferComplete: false,
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

export async function setAgreedPrice(id: string, price: number): Promise<void> {
    await update(ref(database, `requests/${id}`), {
        agreedPrice: price,
        status: 'price_set',
    });
}

export async function confirmPrice(id: string): Promise<void> {
    await update(ref(database, `requests/${id}`), { status: 'price_confirmed' });
}

export async function markPaymentComplete(id: string): Promise<void> {
    await update(ref(database, `requests/${id}`), {
        paymentComplete: true,
        status: 'paid',
    });
}

export async function markTransferComplete(id: string): Promise<void> {
    await update(ref(database, `requests/${id}`), {
        transferComplete: true,
        status: 'completed',
    });
}

// --- Real-Time Listeners ---

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

export function subscribeToSellerRequests(
    sellerPhone: string,
    sellerIdNumber: string,
    callback: (requests: TransactionRequest[]) => void
): Unsubscribe {
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
