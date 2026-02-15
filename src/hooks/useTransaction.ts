import { useState, useCallback } from 'react';
import type { VehicleDetails, BankDetails } from '../services/mockServices';
import {
    createRequest,
    registerSeller as firebaseRegisterSeller,
    type TransactionRequest,
} from '../services/transactionStore';

export type TransactionStep =
    | 'ROLE_SELECT'
    // Buyer steps
    | 'BUYER_VEHICLE_LOOKUP'
    | 'BUYER_ENTER_SELLER'
    | 'BUYER_WAITING_APPROVAL'
    | 'BUYER_DETAILS'
    // Seller steps
    | 'SELLER_REGISTER'
    | 'SELLER_PENDING_REQUESTS'
    // Shared steps (after approval)
    | 'FINANCING_OFFERS'
    | 'DEPOSIT_INSTRUCTIONS'
    | 'PAYMENT_SIMULATION'
    | 'INSURANCE_OFFERS'
    | 'OWNERSHIP_TRANSFER'
    | 'COMPLETE';

interface TransactionState {
    step: TransactionStep;
    role: 'BUYER' | 'SELLER' | null;
    vehicle: VehicleDetails | null;
    pricing: { minPrice: number; maxPrice: number; avgPrice: number } | null;
    ownerCount: number;
    mileage: number;
    price: number;
    userBank: BankDetails | null;
    buyerDetails: any | null;
    sellerDetails: any | null;
    paymentVerified: boolean;
    ownershipTransferVerified: boolean;
    // Seller-side state
    sellerPhone: string;
    sellerIdNumber: string;
    // Request tracking
    currentRequestId: string | null;
    approvedRequest: TransactionRequest | null;
}

export const useTransaction = () => {
    const [state, setState] = useState<TransactionState>({
        step: 'ROLE_SELECT',
        role: null,
        vehicle: null,
        pricing: null,
        ownerCount: 0,
        mileage: 0,
        price: 0,
        userBank: null,
        buyerDetails: null,
        sellerDetails: null,
        paymentVerified: false,
        ownershipTransferVerified: false,
        sellerPhone: '',
        sellerIdNumber: '',
        currentRequestId: null,
        approvedRequest: null,
    });

    // --- Role Selection ---
    const selectRole = (role: 'BUYER' | 'SELLER') => {
        setState(prev => ({
            ...prev,
            role,
            step: role === 'BUYER' ? 'BUYER_VEHICLE_LOOKUP' : 'SELLER_REGISTER',
        }));
    };

    // --- Buyer Flow ---
    const setVehicleForBuyer = (
        vehicle: VehicleDetails,
        pricing: { minPrice: number; maxPrice: number; avgPrice: number },
        ownerCount: number,
        mileage: number
    ) => {
        setState(prev => ({
            ...prev,
            vehicle,
            pricing,
            ownerCount,
            mileage,
            price: pricing.avgPrice,
            step: 'BUYER_ENTER_SELLER',
        }));
    };

    const submitSellerLink = async (sellerPhone: string, sellerIdNumber: string, buyerPhone: string) => {
        if (!state.vehicle || !state.pricing) return;

        const request = await createRequest({
            buyerPhone,
            buyerName: buyerPhone,
            sellerPhone,
            sellerIdNumber,
            vehicle: state.vehicle,
            pricing: state.pricing,
            ownerCount: state.ownerCount,
            mileage: state.mileage,
        });

        setState(prev => ({
            ...prev,
            currentRequestId: request.id,
            step: 'BUYER_WAITING_APPROVAL',
        }));
    };

    const onBuyerApproved = useCallback((request: TransactionRequest) => {
        setState(prev => ({
            ...prev,
            approvedRequest: request,
            price: request.pricing.avgPrice,
            step: 'BUYER_DETAILS',
        }));
    }, []);

    // --- Seller Flow ---
    const registerSeller = async (phone: string, idNumber: string) => {
        await firebaseRegisterSeller(phone, idNumber);
        setState(prev => ({
            ...prev,
            sellerPhone: phone,
            sellerIdNumber: idNumber,
            step: 'SELLER_PENDING_REQUESTS',
        }));
    };

    const sellerApproveRequest = (request: TransactionRequest) => {
        setState(prev => ({
            ...prev,
            approvedRequest: request,
            vehicle: request.vehicle,
            pricing: request.pricing,
            price: request.pricing.avgPrice,
            step: 'COMPLETE',
        }));
    };

    // --- Existing Shared Steps ---
    const setBuyerDetails = (details: any) => {
        const userBank: BankDetails = {
            id: details.bankName,
            name: details.bankName,
            code: '',
            icon: ''
        };
        setState(prev => ({ ...prev, buyerDetails: details, userBank, step: 'FINANCING_OFFERS' }));
    };

    const startPayment = () => {
        setState(prev => ({ ...prev, step: 'PAYMENT_SIMULATION' }));
    };

    const completePayment = () => {
        setState(prev => ({ ...prev, paymentVerified: true, step: 'INSURANCE_OFFERS' }));
    };

    const skipFinancing = () => {
        setState(prev => ({ ...prev, step: 'DEPOSIT_INSTRUCTIONS' }));
    };

    const skipInsurance = () => {
        setState(prev => ({ ...prev, step: 'OWNERSHIP_TRANSFER' }));
    };

    const completeOwnershipTransfer = () => {
        setState(prev => ({ ...prev, ownershipTransferVerified: true, step: 'COMPLETE' }));
    };

    const reset = () => {
        setState({
            step: 'ROLE_SELECT',
            role: null,
            vehicle: null,
            pricing: null,
            ownerCount: 0,
            mileage: 0,
            price: 0,
            userBank: null,
            buyerDetails: null,
            sellerDetails: null,
            paymentVerified: false,
            ownershipTransferVerified: false,
            sellerPhone: '',
            sellerIdNumber: '',
            currentRequestId: null,
            approvedRequest: null,
        });
    };

    return {
        state,
        selectRole,
        setVehicleForBuyer,
        submitSellerLink,
        onBuyerApproved,
        registerSeller,
        sellerApproveRequest,
        setBuyerDetails,
        startPayment,
        completePayment,
        skipFinancing,
        skipInsurance,
        completeOwnershipTransfer,
        reset,
    };
};
