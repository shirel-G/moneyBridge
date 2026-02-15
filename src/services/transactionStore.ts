/**
 * In-memory transaction store that simulates a backend.
 * Allows buyer and seller flows to share state via pub/sub.
 */

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

type Listener = () => void;

class TransactionStore {
    private sellers: Map<string, SellerProfile> = new Map();
    private requests: TransactionRequest[] = [];
    private listeners: Set<Listener> = new Set();

    // --- Seller Registration ---

    registerSeller(phone: string, idNumber: string): SellerProfile {
        const key = this.sellerKey(phone, idNumber);
        const profile: SellerProfile = { phone, idNumber, registeredAt: Date.now() };
        this.sellers.set(key, profile);
        this.notify();
        return profile;
    }

    isSellerRegistered(phone: string, idNumber: string): boolean {
        return this.sellers.has(this.sellerKey(phone, idNumber));
    }

    // --- Transaction Requests ---

    createRequest(req: Omit<TransactionRequest, 'id' | 'status' | 'createdAt'>): TransactionRequest {
        const request: TransactionRequest = {
            ...req,
            id: `REQ-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            status: 'pending',
            createdAt: Date.now(),
        };
        this.requests.push(request);
        this.notify();
        return request;
    }

    getRequestsForSeller(phone: string, idNumber: string): TransactionRequest[] {
        return this.requests.filter(
            (r) => r.sellerPhone === phone && r.sellerIdNumber === idNumber
        );
    }

    getRequestById(id: string): TransactionRequest | undefined {
        return this.requests.find((r) => r.id === id);
    }

    approveRequest(id: string): void {
        const req = this.requests.find((r) => r.id === id);
        if (req) {
            req.status = 'approved';
            this.notify();
        }
    }

    rejectRequest(id: string): void {
        const req = this.requests.find((r) => r.id === id);
        if (req) {
            req.status = 'rejected';
            this.notify();
        }
    }

    // --- Pub/Sub ---

    subscribe(listener: Listener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notify() {
        this.listeners.forEach((fn) => fn());
    }

    private sellerKey(phone: string, idNumber: string): string {
        return `${phone}::${idNumber}`;
    }
}

// Singleton instance
export const transactionStore = new TransactionStore();
